import React, { Fragment, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useUserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";

const LoginRegister = () => {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  const { login, loading, userWriteAtion } = useUserContext();
  const { t } = useTranslation();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ✅ 1) 로그인 함수 (기존 그대로)
  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login({ userId, password });
    if (success) {
      navigate("/");
    }
  };

  // ✅ 3) 회원가입 함수 (기존 그대로)
  const handleWriteAction = async (e) => {
    e.preventDefault();
    const success = await userWriteAtion({
      userId,
      password,
      password2,
      name,
      email,
    });
    if (success) {
      navigate("/");
    }
  };
  const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
const redirectUri = encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI);

const kakaoAuthUrl =
  `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

  return (
    <Fragment>
      <SEO titleTemplate={t("auth.login")} description={t("auth.loginDescription")} />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: t("common.home"), path: process.env.PUBLIC_URL + "/" },
            { label: t("auth.loginRegister"), path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>{t("auth.login")}</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>{t("auth.register")}</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>

                    <Tab.Content>
                      {/* LOGIN */}
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleLogin}>
                              <input
                                type="text"
                                placeholder={t("auth.id")}
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                              />
                              <input
                                type="password"
                                placeholder={t("auth.password")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />

                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">{t("auth.rememberMe")}</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    {t("auth.forgotPassword")}
                                  </Link>
                                </div>
                                <div className="button-row">
                                <button type="submit" disabled={loading}>
                                  <span>{t("auth.login")}</span>
                                </button>
                                <button type="button" className="kakaobutton-login" onClick={() => window.location.href = kakaoAuthUrl}>카카오 로그인</button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>

                      {/* REGISTER */}
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleWriteAction}>
                              <input
                                type="text"
                                placeholder={t("auth.id")}
                                onChange={(e) => setUserId(e.target.value)}
                              />
                              <input
                                type="password"
                                placeholder={t("auth.password")}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <input
                                type="password"
                                placeholder={t("auth.passwordConfirm")}
                                onChange={(e) => setPassword2(e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder={t("auth.name")}
                                onChange={(e) => setName(e.target.value)}
                              />
                              <input
                                type="email"
                                placeholder={t("auth.email")}
                                onChange={(e) => setEmail(e.target.value)}
                              />

                              <div className="button-box">
                                <button type="submit" disabled={loading}>
                                  <span>{t("auth.register")}</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default LoginRegister;
