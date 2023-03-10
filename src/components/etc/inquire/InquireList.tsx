import { useQuery } from '@tanstack/react-query';
import { getInquire } from '../../../api';
import InquirePost from './InquirePost';

const InquireList = () => {
  const {
    isLoading: getLoading,
    isError,
    data,
    error,
  } = useQuery(['inquiers'], getInquire);

  return (
    <div>
      {data?.data &&
        data.data
          .filter((p: any) => p.isDone === false)
          .map((p: any) => <InquirePost key={p.id} p={p} />)}
    </div>
  );
};

export default InquireList;
