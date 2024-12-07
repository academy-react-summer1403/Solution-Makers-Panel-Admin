import { Input } from "reactstrap";

function SearchComponent({ searchTerm, setSearchTerm, width }) {
  return (
    <Input
      className="my-2"
      style={{ width: `${width}%` }}
      placeholder="جستجو کنید ..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}

export default SearchComponent;
