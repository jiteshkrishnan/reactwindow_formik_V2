import { areEqual } from "react-window";
import { useEffect, memo, useCallback, useState } from "react";
import { useSetRecoilState } from "recoil";
import isEqual from "lodash/isEqual";
import UserForm from "./UserForm";
import { deepDiffBetweenObjects } from "./diff";
import { modifiedItems } from "./atoms";

export const Row = memo(({ index, style, data }) => {
  const item = data[index];
  const updateModifiedItems = useSetRecoilState(modifiedItems);
  const [modifiedRow, setModifiedRow] = useState({ ...item });

  useEffect(() => {
    if (!isEqual(item, modifiedRow)) {
      updateModifiedItems((prevModifiedItems) => ({
        ...prevModifiedItems,
        ...{
          [`${modifiedRow.id.name}_${modifiedRow.id.value.replace(
            /[ ]+/g,
            ""
          )}`]: modifiedRow
        }
      }));
    }
  }, [modifiedRow]);

  const updateValues = useCallback((values) => {
    console.log("DIFF### ", deepDiffBetweenObjects(values, item));
    setModifiedRow((prevItem) => ({ ...prevItem, ...values }));
  }, []);

  return (
    <div style={style}>
      <UserForm index={index} updateValues={updateValues} item={modifiedRow} />
    </div>
  );
}, areEqual);
