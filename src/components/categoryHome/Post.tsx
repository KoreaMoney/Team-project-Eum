import * as a from '../../styles/styledComponent/category';
import basicIMG from '../../styles/basicIMG.webp';
import { postType } from '../../types';

type PostProps = {
  post: postType;
  onClick: (post: postType) => Promise<void>;
};

const Post: React.FC<PostProps> = ({ post, onClick }) => {
  const getTimeGap = (posting: number) => {
    const msGap = Date.now() - posting;
    const minuteGap = Math.floor(msGap / 60000);
    const hourGap = Math.floor(msGap / 3600000);
    if (msGap < 0) {
      return '방금 전';
    }
    if (hourGap > 24) {
      const time = new Date(posting);
      const timeGap = time.toJSON().substring(0, 10);
      return timeGap;
    }
    if (minuteGap > 59) {
      return `${hourGap}시간 전`;
    } else {
      if (minuteGap === 0) {
        return '방금 전';
      } else {
        return `${minuteGap}분 전`;
      }
    }
  };

  return (
    <a.PostContainer key={post.id} onClick={() => onClick(post)}>
      <a.PostIMG bgPhoto={post.imgURL ? post.imgURL : basicIMG} />

      <a.ContentContainer>
        <a.InfoBest>{post.category}</a.InfoBest>
        <p>{post.title}</p>
        <p>
          {post.price
            ? post.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : 0}{' '}
          P
        </p>

        <a.BottomContainer>
          <p>{post.nickName}</p>
        </a.BottomContainer>
      </a.ContentContainer>
    </a.PostContainer>
  );
};

export default Post;
