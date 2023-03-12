import { MutatingDots } from 'react-loader-spinner';
import styled from 'styled-components';

const Loader = () => {
  return (
    <LoaderBox>
      <MutatingDots
        height="140"
        width="140"
        color="#FF6C2C"
        secondaryColor="#FF6C2C"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </LoaderBox>
  );
};

export default Loader;
const LoaderBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 300px;
  margin-bottom: 800px;
`;
