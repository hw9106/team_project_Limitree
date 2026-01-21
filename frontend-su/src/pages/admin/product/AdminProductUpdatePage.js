import React, { useMemo, useEffect, useState } from "react";
import * as productApi from "../../../api/productApi";
import { useParams } from 'react-router-dom';
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

const AdminProductUpdatePage = () => {

  const { id } = useParams();
  

  useEffect(() => {

    const fetchProduct = async () => {
       // ✅ id 유효성 검사 추가
    if (!id || isNaN(id)) {
      console.error("유효하지 않은 상품 ID:", id);
      alert("유효하지 않은 상품 ID입니다.");
      return;
    }
      const responseJsonObject = await productApi.findProductById(id);
      if (responseJsonObject.status === 1) {
        const data = responseJsonObject.data;
        setProduct({
          ...emptyProduct,
          ...data,
          categoryText: Array.isArray(data.category)
          ? data.category.join(",")
          : "",
          tagText: Array.isArray(data.tag)
          ? data.tag.join(",")
          : "",
          id: id
        });        

setVariations(
  Array.isArray(data.variation) && data.variation.length > 0
    ? data.variation.map(v => ({
        id: v.id ?? null,
        color: v.color ?? "",
        image: v.image ?? "",
        size: Array.isArray(v.size)
          ? v.size.map(s => ({
              name: s.name ?? "",
              stock: s.stock ?? 0
            }))
          : []
      }))
    : [
        {
          id: null,
          color: "",
          image: "",
          size: []
        }
      ]
);

      }else {
      alert("상품을 찾을 수 없습니다.");
      window.history.back(); // 선택사항
    }
  };
    fetchProduct();
  }, []);

  // ----------------------------
  // Product 입력(화면 입력용)
  // ----------------------------
const emptyProduct = {
  id: null,
  sku: "",
  name: "",
  price: "",
  discount: "",
  offerEnd: "",
  isNew: false,
  rating: "",
  saleCount: "",
  categoryText: "",
  tagText: "",
  stock: "",
  imageText: "",
  shortDescription: "",
  fullDescription: "",
};
const [product, setProduct] = useState(emptyProduct);
  // ----------------------------
  // Variation 입력(색상 단위) + Size
  // ----------------------------
const emptyVariation = {
  id: null,
  color: "",
  image: "",
  size: [
    { name: "", stock: "" }
  ]
};

const [variations, setVariations] = useState([emptyVariation]);



  // 신규 Variation 입력 폼
  const [newVar, setNewVar] = useState({
    color: "",
    image: "",
  });

  // 신규 Size 입력 폼
  const [newSize, setNewSize] = useState({
    variationIndex: 0,
    name: "",
    stock: "",
  });


  const [saving] = useState(false);

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

  // ----------------------------
  // 저장
  // ----------------------------
  const handleSubmit = async () => {
    try{
    const response = await productApi.updateProduct(payload.id, payload);
     if (response.status === 1) {
      alert("상품이 성공적으로 수정되었습니다!");
       window.location.href = "/admin/product"; // 목록으로 이동 (선택사항)
    } else {
      alert(`상품 수정 실패: ${response.msg || '알 수 없는 오류'}`);
    }
  }catch (error) {
    console.error("상품 수정 중 오류:", error);
    alert("상품 수정 중 오류가 발생했습니다.");
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
          <Field label="SKU * (읽기전용)">
            <input name="sku" value={product.sku} onChange={onChangeProduct} style={input} readOnly disabled />
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

          <Field label="rating (읽기전용)">
            <input
              name="rating"
              value={product.rating}
              onChange={onChangeProduct}
              style={input}
              type="number"
              min="0"
              max="5"
              readOnly disabled
            />
          </Field>

          <Field label="saleCount (읽기전용)">
            <input
              name="saleCount"
              value={product.saleCount}
              onChange={onChangeProduct}
              style={input}
              type="number"
              min="0"
              readOnly disabled
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
          <input
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

export default AdminProductUpdatePage;
