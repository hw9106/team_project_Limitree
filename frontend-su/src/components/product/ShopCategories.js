import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { setActiveSort } from "../../helpers/product";

const ShopCategories = ({ categories, getSortParams, selectedCategory }) => {
  const { t, i18n } = useTranslation();

  const labelOf = (categoryValue) => {
    if (i18n.language?.startsWith("ko")) return categoryValue;
    return t(categoryValue, { defaultValue: categoryValue });
  };

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">{t("sidebar.categoriesTitle")}</h4>
      <div className="sidebar-widget-list mt-30">
        {categories && categories.length > 0 ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  className={!selectedCategory ? "active" : ""} // ✅ (추가) 전체면 active
                  onClick={(e) => {
                    getSortParams("category", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> {t("sidebar.allCategories")}
                </button>
              </div>
            </li>

            {categories.map((category, key) => (
              <li key={key}>
                <div className="sidebar-widget-list-left">
                  <button
                    className={selectedCategory === category ? "active" : ""} // ✅ (추가) 선택된 버튼 active
                    onClick={(e) => {
                      getSortParams("category", category);
                      setActiveSort(e);
                    }}
                  >
                    <span className="checkmark" /> {labelOf(category)}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          t("sidebar.noCategories")
        )}
      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func,
  selectedCategory: PropTypes.string // ✅ (추가)
};

export default ShopCategories;
