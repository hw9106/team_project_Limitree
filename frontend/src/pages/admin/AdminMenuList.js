import { Fragment } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SEO from '../../components/seo';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import { useUserContext } from '../../context/UserContext';

const AdminMenuList = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { loginUser } = useUserContext();

  // 🆕 role 필드 사용으로 변경 (하드코딩 제거)
  const isAdmin = loginUser?.roleNames?.includes("ADMIN");
  

  return (
    <Fragment>
      <SEO titleTemplate="관리자" description="관리자 메뉴" />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: t('breadcrumb.home'), path: process.env.PUBLIC_URL + '/' },
            { label: '관리자', path: process.env.PUBLIC_URL + '/admin' },
          ]}
        />

        {isAdmin ? (
          <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <Link to={process.env.PUBLIC_URL + '/admin/users'} className="btn-hover">
                <button className="admin-list-btn">회원 리스트</button>
              </Link>

              <Link to={process.env.PUBLIC_URL + '/admin/product'} className="btn-hover">
                <button className="admin-list-btn">상품 관리</button>
              </Link>

              <Link to={process.env.PUBLIC_URL + '/admin/order'} className="btn-hover">
                <button className="admin-list-btn">주문 관리</button>
              </Link>

              <Link to={process.env.PUBLIC_URL + '/admin/review-list'} className="btn-hover">
                <button className="admin-list-btn">리뷰 관리</button>
              </Link>

              <Link to={process.env.PUBLIC_URL + '/admin/product-xe'} className="btn-hover">
                <button className="admin-list-btn">상품 엑셀 등록</button>
              </Link>
            </div>

            <Outlet />
          </div>
        ) : (
          <div style={{ padding: 24, textAlign: 'center' }}>
            접근 권한이 없습니다.
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>{pathname}</div>
          </div>
        )}
      </LayoutOne>
    </Fragment>
  );
};

export default AdminMenuList;
