import { QueryClient } from '@tanstack/query-core';
import AddForm from './inquire/AddForm';
import InquireList from './inquire/InquireList';

const queryClient = new QueryClient();
const Inquire = () => {
  return (
    <div>
      <AddForm />
      <InquireList />
    </div>
  );
};

export default Inquire;
