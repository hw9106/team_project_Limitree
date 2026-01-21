import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { getCookie } from '../../../util/cookieUtil'; // ✅ 경로 맞게 수정

/**
 * ✅ 엑셀(Products 시트 1개) → ProductDto[] payload 생성 → bulk 업로드
 * - 서버: POST http://localhost:8080/admin/product/bulk-create
 */
export default function AdminProductBulkUploadPage() {
  const [rows, setRows] = useState([]); // 엑셀 row 원본
  const [payloads, setPayloads] = useState([]); // ProductDto[]
  const [saving, setSaving] = useState(false);

  // ----------------------------
  // ✅ JWT Authorization 헤더 생성(쿠키 member에서 accessToken 꺼냄)
  // ----------------------------
  const authHeaders = (extra = {}) => {
    const memberStr = getCookie('member');
    let member = null;

    try {
      member = memberStr ? JSON.parse(memberStr) : null;
    } catch (e) {
      member = null;
    }

    const accessToken = member?.accessToken;

    return {
      ...extra,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
  };

  // ----------------------------
  // 유틸
  // ----------------------------
  const splitComma = (text) =>
    (text || '')
      .split(',')
      .map((v) => String(v).trim())
      .filter(Boolean);

  const toNumberOrNull = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const toBool = (v) => {
    const s = String(v ?? '')
      .trim()
      .toLowerCase();
    return s === 'true' || s === '1' || s === 'y' || s === 'yes';
  };

  // ----------------------------
  // ✅ 핵심: rows(엑셀) -> ProductDto[]
  // ----------------------------
  const buildPayloads = (excelRows) => {
    const productMap = new Map();

    const getOrCreateProduct = (r) => {
      const sku = String(r.sku || '').trim();
      if (!sku) return null;

      if (!productMap.has(sku)) {
        productMap.set(sku, {
          id: null,
          sku,
          name: String(r.name || '').trim(),
          price: toNumberOrNull(r.price),
          discount: toNumberOrNull(r.discount),
          offerEnd: String(r.offerEnd || '').trim() || null,
          isNew: toBool(r.isNew),
          rating: toNumberOrNull(r.rating),
          saleCount: toNumberOrNull(r.saleCount),
          category: splitComma(r.categoryText),
          tag: splitComma(r.tagText),
          stock: toNumberOrNull(r.stock),
          image: splitComma(r.imageText),
          shortDescription: String(r.shortDescription || '').trim() || null,
          fullDescription: String(r.fullDescription || '').trim() || null,
          variation: [],
        });
      }
      return productMap.get(sku);
    };

    const getOrCreateVariation = (product, r) => {
      const color = String(r.color || '').trim();
      if (!color) return null;

      const key = color.toLowerCase();
      let v = product.variation.find((x) => x.color.toLowerCase() === key);
      if (!v) {
        v = {
          id: null,
          color,
          image: String(r.variationImage || '').trim(),
          size: [],
        };
        product.variation.push(v);
      } else {
        const img = String(r.variationImage || '').trim();
        if (!v.image && img) v.image = img;
      }
      return v;
    };

    for (const r of excelRows) {
      const p = getOrCreateProduct(r);
      if (!p) continue;

      const v = getOrCreateVariation(p, r);
      if (!v) continue;

      const sizeName = String(r.sizeName || '').trim();
      const sizeStock = toNumberOrNull(r.sizeStock);

      if (sizeName) {
        if (!v.size.some((s) => s.name.toLowerCase() === sizeName.toLowerCase())) {
          v.size.push({
            name: sizeName,
            stock: sizeStock ?? 0,
          });
        }
      }
    }

    return Array.from(productMap.values());
  };

  // ----------------------------
  // 엑셀 파일 업로드 핸들러
  // ----------------------------
  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });

    const sheet = wb.Sheets['Products'];
    if (!sheet) {
      alert('엑셀에 "Products" 시트가 있어야 합니다.');
      return;
    }

    const excelRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    setRows(excelRows);

    const built = buildPayloads(excelRows);
    setPayloads(built);

    console.log('ROW 0:', excelRows[0]);
    console.log('ROW 6:', excelRows[6]);
    console.log('ROW 6 keys:', Object.keys(excelRows[6] || {}));
    console.log('ROW 6 color:', excelRows[6]?.color, 'sku:', excelRows[6]?.sku);
  };

  // ----------------------------
  // 간단 검증(업로드 전에)
  // ----------------------------
  const validateAll = () => {
    if (!payloads.length) return '업로드할 데이터가 없습니다.';

    for (let i = 0; i < payloads.length; i++) {
      const p = payloads[i];
      if (!p.sku) return `(${i}) sku 누락`;
      if (!p.name) return `(${i}) name 누락: sku=${p.sku}`;
      if (p.price === null || p.price < 0) return `(${i}) price 오류: sku=${p.sku}`;
      if (!p.image || p.image.length === 0) return `(${i}) imageText 필요: sku=${p.sku}`;
      if (!p.variation || p.variation.length === 0) return `(${i}) variation 필요: sku=${p.sku}`;

      for (const v of p.variation) {
        if (!v.color) return `(${i}) variation.color 누락: sku=${p.sku}`;
        for (const s of v.size || []) {
          if (!s.name) return `(${i}) size.name 누락: sku=${p.sku}`;
          if (s.stock === null || s.stock < 0) return `(${i}) size.stock 오류: sku=${p.sku}`;
        }
      }
    }
    return null;
  };

  // ----------------------------
  // ✅ 서버로 bulk 전송 (JWT 토큰 포함)
  // ----------------------------
  const handleUpload = async () => {
    const msg = validateAll();
    if (msg) return alert(msg);

    // ✅ 로그인/토큰 없는 경우 업로드 막기(선택이지만 추천)
    const memberStr = getCookie('member');
    if (!memberStr) return alert('로그인이 필요합니다.');

    setSaving(true);

    try {
      const res = await fetch('http://localhost:8080/admin/product/bulk-create', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }), // ✅ 토큰 포함
        body: JSON.stringify(payloads),
      });

      // 서버가 401/403을 주면 여기서 메시지 확인 가능
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `업로드 실패 (status: ${res.status})`);
      }

      alert('엑셀 업로드 성공!');
      window.location.reload(); // 페이지 새로고침 
    } catch (e) {
      console.error(e);
      alert(`에러: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h2 style={{ margin: 0 }}>상품 엑셀 일괄 업로드</h2>
      <p style={{ marginTop: 6, opacity: 0.7 }}>
        Products 시트 1개를 읽어서 ProductDto[]로 묶은 뒤 bulk API로 전송합니다.
      </p>

      <div style={{ marginTop: 12 }}>
        <input type="file" accept=".xlsx,.xls" onChange={onFileChange} />
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700 }}>엑셀 Row 수:</div>
        <div>{rows.length}</div>

        <div style={{ marginTop: 10, fontWeight: 700 }}>생성된 상품 수(ProductDto[]):</div>
        <div>{payloads.length}</div>
      </div>

      <section style={{ marginTop: 16 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>전송 JSON 미리보기(상위 1개)</h3>
        <pre
          style={{
            background: '#0b1020',
            color: '#e5e7eb',
            padding: 12,
            borderRadius: 12,
            overflow: 'auto',
            maxHeight: 360,
            fontSize: 12,
          }}
        >
          {JSON.stringify(payloads[0] || {}, null, 2)}
        </pre>

        <button
          type="button"
          onClick={handleUpload}
          disabled={saving || payloads.length === 0}
          style={{
            width: '100%',
            height: 44,
            marginTop: 10,
            borderRadius: 10,
            border: '1px solid #111827',
            background: '#111827',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {saving ? '업로드 중...' : '엑셀 업로드 (POST /admin/product/bulk-create)'}
        </button>
      </section>
    </div>
  );
}
