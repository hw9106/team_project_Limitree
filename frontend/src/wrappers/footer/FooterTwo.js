import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";

const FooterTwo = ({
  backgroundColorClass,
  copyrightColorClass,
  spaceLeftClass,
  spaceRightClass,
  footerTopBackgroundColorClass,
  footerTopSpaceTopClass,
  footerTopSpaceBottomClass,
  footerLogo,
  backgroundImage,
}) => {
  return (
    <footer
      className={clsx(
        "footer-area",
        backgroundColorClass,
        spaceLeftClass,
        spaceRightClass,
        backgroundImage && "bg-img"
      )}
      style={{
        backgroundImage: ` ${
          backgroundImage
            ? `url(${process.env.PUBLIC_URL + backgroundImage})`
            : `url()`
        }`,
      }}
    >
      <div
        className={clsx(
          "footer-top text-center",
          footerTopBackgroundColorClass,
          footerTopSpaceTopClass,
          footerTopSpaceBottomClass
        )}
      >
        <div className="container">
          <div className="footer-logo">
            <Link to={process.env.PUBLIC_URL}>
              <img
                alt=""
                src={
                  process.env.PUBLIC_URL +
                  `${footerLogo ? footerLogo : "/assets/img/logo/logo.png"}`
                }
              />
            </Link>
          </div>
          <p>
            LIMITRRE는 일상의 공간을 보다 편안하고 아름답게 완성하는 프리미엄
            가구 브랜드입니다. 단순한 기능을 넘어, 삶의 방식과 취향을 담아낸
            디자인 가구를 통해 지속 가능한 가치와 세련된 공간 경험을 동시에
            제안합니다.
          </p>
        
        </div>
      </div>
      <div className="footer-bottom text-center">
        <div className="container">
          <div className={clsx("copyright-2", copyrightColorClass)}>
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <a
                href="//www.hasthemes.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                LIMITRRE
              </a>
              . All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

FooterTwo.propTypes = {
  backgroundColorClass: PropTypes.string,
  copyrightColorClass: PropTypes.string,
  footerLogo: PropTypes.string,
  backgroundImage: PropTypes.string,
  footerTopBackgroundColorClass: PropTypes.string,
  footerTopSpaceBottomClass: PropTypes.string,
  footerTopSpaceTopClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
};

export default FooterTwo;
