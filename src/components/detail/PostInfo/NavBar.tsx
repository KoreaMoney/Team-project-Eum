import { useState } from 'react';
import { NavButtonProps } from '../../../types';
import styled from 'styled-components';

const NavBar = () => {
  const [isDescriptionActive, setIsDescriptionActive] = useState(true);
  const [isReviewActive, setIsReviewActive] = useState(false);

  const onClickNavExSeller = () => {
    setIsDescriptionActive(true);
    setIsReviewActive(false);
    scrollToTop();
  };
  const onClickNavReview = () => {
    setIsDescriptionActive(false);
    setIsReviewActive(true);
    goReview();
  };

  /**설명이나 판매자 누르면 맨위로 */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**후기 누르면 후기로 */
  const goReview = () => {
    window.scrollTo({
      top: 1306,
      behavior: 'smooth',
    });
  };

  return (
    <NavContainer>
      <NavButtons
        active={isDescriptionActive}
        onClick={onClickNavExSeller}
        aria-label="설명"
      >
        설명
      </NavButtons>
      <NavButtons
        active={isDescriptionActive}
        onClick={onClickNavExSeller}
        aria-label="판매자"
      >
        판매자
      </NavButtons>
      <NavButtons
        active={isReviewActive}
        style={{ borderRight: 'none' }}
        onClick={onClickNavReview}
        aria-label="후기"
      >
        후기
      </NavButtons>
    </NavContainer>
  );
};

export default NavBar;

const NavContainer = styled.div`
  display: flex;
  position: sticky;
  z-index: 5;
  top: 90px;
  width: 1200px;
  height: 80px;
  padding: 30px 0;
  border-top: 1px solid ${(props) => props.theme.colors.gray20};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 60px;
  margin-top: 80px;
  background-color: ${(props) => props.theme.colors.white};
`;

const NavButtons = styled.button<NavButtonProps>`
  padding: none;
  background-color: ${(props) => props.theme.colors.white};
  border: none;
  border-right: 1px solid ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  color: ${(props) =>
    props.active ? props.theme.colors.black : props.theme.colors.gray20};
  cursor: pointer;
`;
