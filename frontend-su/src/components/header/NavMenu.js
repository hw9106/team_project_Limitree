import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import useCategoryTree from "../../hooks/useCategoryTree";

const NavMenu = ({ menuWhiteClass, sidebarMenu }) => {
  const { t } = useTranslation();

  const { categoryTree, loading, error } = useCategoryTree();

  if (loading) return null;
  if (error) return <div>카테고리를 불러올 수 없습니다.</div>;

const toShopByCat = (nameKey) =>
  process.env.PUBLIC_URL +
  `/shop-grid-standard?cat=${encodeURIComponent(t(nameKey))}`;

  return (
    <div
      className={clsx(
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`,
      )}
    >
      <nav>
        <ul>
          {categoryTree?.map((menu) => (
            <li key={menu.categoryId}>
              <Link to={toShopByCat(menu.nameKey)}>
                {t(menu.nameKey)}
                {menu.children?.length > 0 &&
                  (sidebarMenu ? (
                    <span>
                      <i className="fa fa-angle-right" />
                    </span>
                  ) : (
                    <i className="fa fa-angle-down" />
                  ))}
              </Link>

              {menu.children?.length > 0 && (
                <ul className="submenu">
                  <li>
                    <ul>
                      {menu.children.map((child) => (
                        <li key={child.categoryId}>
                          <Link to={toShopByCat(child.nameKey)}>
                            {t(child.nameKey)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
};

export default NavMenu;
