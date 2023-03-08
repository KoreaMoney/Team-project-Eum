import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import {
  userBadgeLengthAtom,
  userCommentsAtom,
  userPostsAtom,
} from '../../atom';
import { NavButtonProps } from '../../types';

const Nav = () => {
  const [isSellerActive, setIsSellerActive] = useState(false);
  const [isReviewActive, setIsReviewActive] = useState(false);
  const [isBadgeActive, setIsBadgeActive] = useState(true);
  const badgeLength = useRecoilValue(userBadgeLengthAtom);
  const userPosts = useRecoilValue(userPostsAtom);
  const userComments = useRecoilValue(userCommentsAtom);

  const onClickNavBadge = () => {
    setIsSellerActive(false);
    setIsReviewActive(false);
    setIsBadgeActive(true);
    scrollToTop();
  };
  const onClickNavReview = () => {
    setIsSellerActive(false);
    setIsReviewActive(true);
    setIsBadgeActive(false);
    goReview();
  };
  const onClickSeller = () => {
    setIsSellerActive(true);
    setIsReviewActive(false);
    setIsBadgeActive(false);
    goSeller();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goReview = () => {
    window.scrollTo({
      top: 1650,
      behavior: 'smooth',
    });
  };

  const goSeller = () => {
    window.scrollTo({
      top: 700,
      behavior: 'smooth',
    });
  };
  return (
    <NavContainer>
      <NavButtons active={isBadgeActive} onClick={onClickNavBadge}>
        배지 ({badgeLength})
      </NavButtons>
      <NavButtons active={isSellerActive} onClick={onClickSeller}>
        판매상품 ({userPosts && userPosts.length})
      </NavButtons>
      <NavButtons
        active={isReviewActive}
        style={{ borderRight: 'none' }}
        onClick={onClickNavReview}
      >
        받은 후기 ({userComments?.length})
      </NavButtons>
    </NavContainer>
  );
};

export default Nav;

export const NavContainer = styled.div`
  display: flex;
  position: sticky;
  z-index: 5;
  top: 112px;
  width: 1200px;
  height: 80px;
  padding: 30px 0;
  border-top: 1px solid ${(props) => props.theme.colors.gray20};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 30px;
  margin-top: 48px;
  background-color: ${(props) => props.theme.colors.white};
`;

export const NavButtons = styled.button<NavButtonProps>`
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
