import PropTypes from 'prop-types';
import clsx from 'clsx';
import LanguageCurrencyChanger from './sub-components/LanguageCurrencyChanger';
import { ShopGlobalCommonContext } from '../../App';
import { useContext } from 'react';

const HeaderTop = ({ borderStyle }) => {
  const { currency } = useContext(ShopGlobalCommonContext);

  return (
    <div className={clsx('header-top-wap', borderStyle === 'fluid-border' && 'border-bottom')}>
      <LanguageCurrencyChanger currency={currency} />
    </div>
  );
};

HeaderTop.propTypes = {
  borderStyle: PropTypes.string,
};

export default HeaderTop;
