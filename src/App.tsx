import axios from "axios";
import { FormEvent, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
  useMutation,
} from "react-query";

interface User {
  id: Date;
  name: string;
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <List />
      <Input />
    </QueryClientProvider>
  );
}

function List() {
  const getList = () => {
    return axios
      .get("http://localhost:9000/list")
      .then((response) => response.data);
  };

  const { isLoading, isError, data } = useQuery(["list"], getList);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  return (
    <div>
      <ul>
        {data.map((user: User) => (
          <li key={String(user.id)}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

const Input = () => {
  const [name, setName] = useState<string>("");

  const postUser = (newUserName: string) => {
    return axios.post("http://localhost:9000/list", {
      id: new Date(),
      name: newUserName,
    });
  };

  const queryClient = useQueryClient();
  const listMutation = useMutation(postUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["list"]);
    },
  });

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    listMutation.mutate(name);
  };

  const onNameInputChange = (value: string) => setName(value);

  return (
    <form onSubmit={onFormSubmit}>
      <input type="text" onChange={(e) => onNameInputChange(e.target.value)} />
      <button>추가</button>
      {listMutation.isLoading && <div>isLoading...</div>}
      {listMutation.isError && <div>isError...</div>}
    </form>
  );
};

export default App;
