import { FixedSizeList as List } from "react-window";
import { useEffect, useState } from "react";
import { useRecoilCallback } from "recoil";
import { modifiedItems } from "./atoms";
import "./styles.css";
import { Row } from "./Row";

export default function App() {
  const [records, setRecords] = useState([]);
  console.log("Records ", records);

  const getModifiedRows = useRecoilCallback(({ snapshot }) => async () => {
    const modifiedRows = await snapshot.getPromise(modifiedItems);
    console.log("modifiedRows: ", modifiedRows);
  });

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=50&nat=gb")
      .then((res) => res.json())
      .then(({ results: data }) =>
        data.map((user) => ({
          ...user,
          friends: [
            { first: "John", last: "Grisham" },
            { first: "Peter", last: "Kirsten" }
          ]
        }))
      )
      .then((records) => setRecords(records));
  }, []);
  return (
    <div className="App">
      <button onClick={getModifiedRows}>Get Modified rows</button>
      <List
        height={700}
        itemCount={records.length}
        itemData={records}
        itemSize={100}
        width={1000}
      >
        {Row}
      </List>
    </div>
  );
}
