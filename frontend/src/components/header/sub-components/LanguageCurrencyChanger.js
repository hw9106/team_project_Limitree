import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ShopGlobalCommonContext } from "../../../App";
import { Link } from "react-router-dom";
import { useUserContext } from "../../../context/UserContext";

const LanguageCurrencyChanger = () => {
  const { i18n, t } = useTranslation();
  const { currency, setCurrency } = useContext(ShopGlobalCommonContext);
  const { loginUser } = useUserContext();
  const changeLanguageTrigger = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  const isAdmin = loginUser?.roleNames?.includes("ADMIN");
  

  const setCurrencyTrigger = (e) => {
    const currencyName = e.target.value;
    const currencyMap = {
      USD: {
        currencyName: "USD",
        currencySymbol: "$",
        currencyRate: 1,
        decimal: 2,
      },
      KRW: {
        currencyName: "KRW",
        currencySymbol: "₩",
        currencyRate: 1,
        decimal: 0,
      },
    };

    setCurrency(currencyMap[currencyName]);
  };
  const adminList = () => process.env.PUBLIC_URL + "/admin";

  return (
    <div className="language-currency-wrap">
      <div className="same-language-currency language-style">
        <span>
          {i18n.resolvedLanguage === "en"
            ? "English"
            : i18n.resolvedLanguage === "ko"
            ? "Korean"
            : ""}{" "}
          <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              <button value="en" onClick={changeLanguageTrigger}>
                English
              </button>
            </li>
            <li>
              <button value="ko" onClick={changeLanguageTrigger}>
                Korean
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="same-language-currency use-style">
        <span>
          {currency.currencyName} <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              <button value="USD" onClick={setCurrencyTrigger}>
                USD
              </button>
            </li>
            <li>
              <button value="KRW" onClick={setCurrencyTrigger}>
                KRW
              </button>
            </li>
          </ul>
        </div>
      </div>
      {isAdmin? (
        <div>
          <Link to={adminList()} className="btn-hover">
            <button className="admin-list-btn">{t("admin.admin-list")}</button>
          </Link>
        </div>
      ) : ("")}
    </div>
  );
};

export default LanguageCurrencyChanger;
