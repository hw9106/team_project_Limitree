import React, { useMemo, useContext, useState } from "react";
import * as productApi from "../../../api/productApi";
import { ShopGlobalCommonContext } from '../../../App';

/**
 * ✅ ProductDto / Variation / Size DTO에 100% 맞춘 "상품 등록" 완성형 페이지
 *
 * - ProductDto
 *   - category: List<String>
 *   - tag: List<String>
 *   - image: List<String>
 *   - variation: List<Variation>
 *
 * - Variation
 *   - color: string
 *   - image: string
 *   - size: List<Size>  (Size: { name, stock } 라고 가정)
 *
 * ✅ 서버 저장: POST /api/products (원하는 엔드포인트로 변경)
 */
const AdminProductCreatePage = () => {
  const { products } = useContext(ShopGlobalCommonContext);
  // ----------------------------
  // Product 입력(화면 입력용)
  // ----------------------------
  const [product, setProduct] = useState({
    id: null,
    sku: "TSH-WH-001",
    name: "클래식 화이트 티셔츠",
    price: "29000", // BigDecimal 대응: 문자열로 입력 받고 전송 시 Number로
    discount: "10",
    offerEnd: "2026-12-31",
    isNew: true,
    rating: "5",
    saleCount: "150",
    categoryText: "의류,상의,티셔츠", // 입력은 콤마 문자열로
    tagText: "베스트셀러,신상품,기본템", // 입력은 콤마 문자열로
    stock: "500",
    imageText: "/assets/img/product/fashion/1.jpg", // 입력은 하나 또는 콤마로 여러개도 가능
    shortDescription: "편안한 착용감의 베이직 화이트 티셔츠",
    fullDescription:
      "100% 면 소재로 제작된 프리미엄 화이트 티셔츠입니다. 일상복으로 활용하기 좋으며 모든 스타일에 잘 어울립니다.",
  });

  // ----------------------------
  // Variation 입력(색상 단위) + Size
  // ----------------------------
  const [variations, setVariations] = useState([
    {
      id: null,
      color: "white",
      image: "/assets/img/product/fashion/1.jpg",
      size: [
        { name: "S", stock: 100 }
      ],
    },
  ]);

  // 신규 Variation 입력 폼
  const [newVar, setNewVar] = useState({
    color: "WHITE",
    image: "/assets/img/product/",
  });

  // 신규 Size 입력 폼
  const [newSize, setNewSize] = useState({
    variationIndex: 0,
    name: "FREE",
    stock: "100",
  });

  const [saving, setSaving] = useState(false);

  // ----------------------------
  // 유틸
  // ----------------------------
  const splitComma = (text) =>
    (text || "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const toNumberOrNull = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const onChangeProduct = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ----------------------------
  // Variation 핸들러
  // ----------------------------
  const addVariation = () => {
    const color = newVar.color.trim();
    const image = newVar.image.trim();

    if (!color) return alert("Variation color는 필수입니다.");

    // color 중복 방지(원하면 제거 가능)
    if (variations.some((v) => v.color.toLowerCase() === color.toLowerCase())) {
      return alert("이미 존재하는 color 입니다.");
    }

    setVariations((prev) => [
      ...prev,
      { id: null, color, image, size: [] },
    ]);
    setNewVar({ color: "", image: "" });
    setNewSize((s) => ({ ...s, variationIndex: variations.length })); // 새 variation 선택
  };

  const removeVariation = (idx) => {
    setVariations((prev) => prev.filter((_, i) => i !== idx));
    setNewSize((s) => ({ ...s, variationIndex: 0 }));
  };

  // ----------------------------
  // Size 핸들러
  // ----------------------------
  const addSize = () => {
    const vi = Number(newSize.variationIndex);
    if (!variations[vi]) return alert("대상 variation을 선택하세요.");

    const name = newSize.name.trim();
    const stock = toNumberOrNull(newSize.stock);

    if (!name) return alert("사이즈 name은 필수입니다. (예: S, M, L)");
    if (stock === null || stock < 0) return alert("stock은 0 이상의 숫자여야 합니다.");

    setVariations((prev) =>
      prev.map((v, idx) => {
        if (idx !== vi) return v;

        // 사이즈 중복 방지(원하면 제거 가능)
        if (v.size.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
          alert("이미 존재하는 사이즈입니다.");
          return v;
        }

        return {
          ...v,
          size: [...v.size, { name, stock }],
        };
      })
    );

    setNewSize((s) => ({ ...s, name: "", stock: "" }));
  };

  const removeSize = (variationIndex, sizeIndex) => {
    setVariations((prev) =>
      prev.map((v, i) => {
        if (i !== variationIndex) return v;
        return { ...v, size: v.size.filter((_, si) => si !== sizeIndex) };
      })
    );
  };

  // ----------------------------
  // ✅ ProductDto에 맞는 최종 payload
  // ----------------------------
  const payload = useMemo(() => {
    const imageList = splitComma(product.imageText);
    return {
      id: product.id, // 신규면 null
      sku: product.sku?.trim() || "",
      name: product.name?.trim() || "",
      price: toNumberOrNull(product.price), // BigDecimal은 서버에서 변환
      discount: toNumberOrNull(product.discount),
      offerEnd: product.offerEnd?.trim() || null,
      isNew: !!product.isNew,
      rating: toNumberOrNull(product.rating),
      saleCount: toNumberOrNull(product.saleCount),
      category: splitComma(product.categoryText),
      tag: splitComma(product.tagText),
      stock: toNumberOrNull(product.stock),
      image: imageList, // List<String>
      shortDescription: product.shortDescription?.trim() || null,
      fullDescription: product.fullDescription?.trim() || null,

      // ✅ DTO 키 이름 그대로 "variation"
      variation: variations.map((v) => ({
        id: v.id, // 신규면 null
        color: v.color,
        image: v.image,
        // ✅ DTO 키 이름 그대로 "size"
        size: (v.size || []).map((s) => ({
          name: s.name,
          stock: toNumberOrNull(s.stock),
        })),
      })),
    };
  }, [product, variations]);

  // ----------------------------
  // 검증
  // ----------------------------
  const validate = () => {
    if (!payload.sku) return "SKU는 필수입니다.";
    if (!payload.name) return "상품명은 필수입니다.";
    if (payload.price === null || payload.price < 0) return "price는 0 이상의 숫자여야 합니다.";
    if (!payload.image || payload.image.length === 0) return "image는 최소 1개 필요합니다.";
    // if (!payload.variation || payload.variation.length === 0) return "variation(색상)은 최소 1개 필요합니다.";

    for (const v of payload.variation) {
      if (!v.color) return "variation.color는 필수입니다.";
      // size는 필수로 강제할거면 아래 주석 해제
      // if (!v.size || v.size.length === 0) return `${v.color} variation에 size가 1개 이상 필요합니다.`;
      for (const s of v.size || []) {
        if (!s.name) return "size.name은 필수입니다.";
        if (s.stock === null || s.stock < 0) return "size.stock은 0 이상의 숫자여야 합니다.";
      }
    }
    return null;
  };

  // ----------------------------
  // 저장
  // ----------------------------
  const handleSubmit = async () => {
    const msg = validate();
    if (msg) return alert(msg);
console.log("payload :: ", payload);
    setSaving(true);
    try {
      // ✅ 네 스프링 컨트롤러 URL로 바꿔줘
          const res =  await fetch(`http://localhost:8080/product/create`, {
    method: "POST",
    headers: {"Content-Type":"application/json",
              "Authorization": `Bearer ${localStorage.getItem('accessToken')}` // ← JWT 토큰 추가
    },
    credentials: 'include',  // 이 요청에 쿠키(세션, refresh Token 등)도 함께 보낼때 사용.
    body: JSON.stringify(payload),
      });


      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `저장 실패 (status: ${res.status})`);
      }

      alert("상품 등록 성공!");
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
    <div style={page}>
      <h2 style={{ margin: 0 }}>상품 등록</h2>
      <p style={{ marginTop: 6, opacity: 0.7 }}>
        ProductDto / Variation / Size 구조로 저장되는 관리자 등록 페이지
      </p>

      {/* Product */}
      <section style={card}>
        <h3 style={title}>상품 기본정보(ProductDto)</h3>

        <div style={grid2}>
          <Field label="SKU *">
            <input name="sku" value={product.sku} onChange={onChangeProduct} style={input} />
          </Field>

          <Field label="상품명 *">
            <input name="name" value={product.name} onChange={onChangeProduct} style={input} />
          </Field>

          <Field label="가격(price) *">
            <input
              name="price"
              value={product.price}
              onChange={onChangeProduct}
              style={input}
              inputMode="numeric"
            />
          </Field>

          <Field label="할인율(discount)">
            <input
              name="discount"
              value={product.discount}
              onChange={onChangeProduct}
              style={input}
              type="number"
              min="0"
              max="100"
            />
          </Field>

          <Field label="offerEnd">
            <input name="offerEnd" value={product.offerEnd} onChange={onChangeProduct} style={input} />
          </Field>

          <Field label="isNew">
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="isNew" checked={product.isNew} onChange={onChangeProduct} />
              신상품
            </label>
          </Field>

          <Field label="rating">
            <input
              name="rating"
              value={product.rating}
              onChange={onChangeProduct}
              style={input}
              type="number"
              min="0"
              max="5"
            />
          </Field>

          <Field label="saleCount">
            <input
              name="saleCount"
              value={product.saleCount}
              onChange={onChangeProduct}
              style={input}
              type="number"
              min="0"
            />
          </Field>

          <Field label="stock(총재고)">
            <input name="stock" value={product.stock} onChange={onChangeProduct} style={input} type="number" min="0" />
          </Field>

          <Field label="image(List) * (콤마로 여러개 가능)">
            <input name="imageText" value={product.imageText} onChange={onChangeProduct} style={input} />
          </Field>

          <Field label="category(List) (콤마 구분)">
            <input name="categoryText" value={product.categoryText} onChange={onChangeProduct} style={input} />
          </Field>

          <Field label="tag(List) (콤마 구분)">
            <input name="tagText" value={product.tagText} onChange={onChangeProduct} style={input} />
          </Field>
        </div>

        <Field label="shortDescription">
          <input
            name="shortDescription"
            value={product.shortDescription}
            onChange={onChangeProduct}
            style={input}
          />
        </Field>

        <Field label="fullDescription">
          <textarea
            name="fullDescription"
            value={product.fullDescription}
            onChange={onChangeProduct}
            style={{ ...input, minHeight: 90 }}
          />
        </Field>
      </section>

      {/* Variation add */}
      <section style={card}>
        <h3 style={title}>옵션(Variation) 추가</h3>

        <div style={row}>
          <Field label="color *">
            <input
              value={newVar.color}
              onChange={(e) => setNewVar((p) => ({ ...p, color: e.target.value }))}
              style={input}
              placeholder="ex) white"
            />
          </Field>

          <Field label="image">
            <input
              value={newVar.image}
              onChange={(e) => setNewVar((p) => ({ ...p, image: e.target.value }))}
              style={input}
              placeholder="/assets/img/..."
            />
          </Field>

          <button type="button" onClick={addVariation} style={btn}>
            + Variation 추가
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          {variations.length === 0 ? (
            <div style={{ opacity: 0.7 }}>아직 variation이 없습니다.</div>
          ) : (
            variations.map((v, idx) => (
              <div key={`${v.color}-${idx}`} style={subCard}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div>
                      <b>#{idx + 1}</b> <span style={{ opacity: 0.7 }}>(Variation)</span>
                    </div>
                    <div>
                      <b>color:</b> {v.color}
                    </div>
                    <div>
                      <b>image:</b> {v.image || "(없음)"}
                    </div>
                  </div>

                  <button type="button" onClick={() => removeVariation(idx)} style={btnDanger}>
                    Variation 삭제
                  </button>
                </div>

                <div style={{ marginTop: 10 }}>
                  <b>Sizes</b>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {v.size.length === 0 ? (
                      <span style={{ opacity: 0.7 }}>사이즈 없음</span>
                    ) : (
                      v.size.map((s, si) => (
                        <span key={`${s.name}-${si}`} style={pill}>
                          {s.name} / stock {s.stock}
                          <button
                            type="button"
                            onClick={() => removeSize(idx, si)}
                            style={pillBtn}
                            title="삭제"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Size add */}
      <section style={card}>
        <h3 style={title}>사이즈(Size) 추가</h3>

        <div style={row}>
          <Field label="대상 variation">
            <select
              value={newSize.variationIndex}
              onChange={(e) => setNewSize((p) => ({ ...p, variationIndex: e.target.value }))}
              style={input}
            >
              {variations.map((v, idx) => (
                <option key={`${v.color}-${idx}`} value={idx}>
                  #{idx + 1} - {v.color}
                </option>
              ))}
            </select>
          </Field>

          <Field label="size name *">
            <input
              value={newSize.name}
              onChange={(e) => setNewSize((p) => ({ ...p, name: e.target.value }))}
              style={input}
              placeholder="S / M / L / XL"
            />
          </Field>

          <Field label="stock *">
            <input
              value={newSize.stock}
              onChange={(e) => setNewSize((p) => ({ ...p, stock: e.target.value }))}
              style={input}
              type="number"
              min="0"
            />
          </Field>

          <button type="button" onClick={addSize} style={btn}>
            + Size 추가
          </button>
        </div>
      </section>

      {/* Payload preview + submit */}
      <section style={card}>
        <h3 style={title}>전송 JSON 미리보기</h3>
        <pre style={pre}>{JSON.stringify(payload, null, 2)}</pre>

        <button type="button" onClick={handleSubmit} style={{ ...btn, width: "100%" }} disabled={saving}>
          {saving ? "저장 중..." : "저장하기 (POST /api/products)"}
        </button>
      </section>
    </div>
  );
};

// ----------------------------
// UI Helpers (간단 스타일)
// ----------------------------
const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 240, flex: 1 }}>
    <span style={{ fontSize: 13, opacity: 0.8 }}>{label}</span>
    {children}
  </div>
);

const page = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: 24,
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
};

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
  marginTop: 16,
  background: "#fff",
};

const subCard = {
  border: "1px solid #eef2f7",
  borderRadius: 14,
  padding: 12,
  marginTop: 12,
  background: "#fafafa",
};

const title = { margin: 0, marginBottom: 12, fontSize: 16 };

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };

const row = { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" };

const input = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  outline: "none",
};

const btn = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #111827",
  background: "#111827",
  color: "white",
  cursor: "pointer",
  height: 42,
};

const btnDanger = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ef4444",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
  height: 42,
};

const pre = {
  background: "#0b1020",
  color: "#e5e7eb",
  padding: 12,
  borderRadius: 12,
  overflow: "auto",
  maxHeight: 360,
  fontSize: 12,
};

const pill = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #e5e7eb",
  background: "#fff",
  fontSize: 13,
};

const pillBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
};

export default AdminProductCreatePage;
