import { areEqual } from "react-window";
import { useEffect, memo, useCallback, useState } from "react";
import { useSetRecoilState, useRecoilCallback } from "recoil";
import isEqual from "lodash/isEqual";
import UserForm from "./UserForm";
import { deepDiffBetweenObjects } from "./diff";
import { modifiedItems } from "./atoms";

/**
 * Row component that renders the UserForm
 */
export const Row = memo(({ index, style, data }) => {
  //Get the user record based on index
  const item = data[index];

  // handler that will update the modified row to the recoil state atom
  //This atom is used for tracking which rows have been modified
  const updateModifiedItems = useSetRecoilState(modifiedItems);

  //function that is used to get the modified row object if present in the recoil state atom
  //This is used , so that the form state (userForm) can be constructed with the modified data
  //when this row has been remounted (when you have scrolled down the virtual list and then scrolled
  // scrolled back to the top)
  const getModifiedRowItem = useRecoilCallback(({ snapshot }) => async () => {
    const modifiedRows = await snapshot.getPromise(modifiedItems);
    return modifiedRows[
      `${item.id.name}_${item.id.value.replace(/[ ]+/g, "")}`
    ];
  });

  // Local state that will be maintained by this Row component, During susbequent renders
  // allthe form changes will be maintained and tracked here
  const [modifiedRow, setModifiedRow] = useState({
    ...item
  });

  //When the component is mounted the modified state will be also merged with the local state
  //else the row changes will be lost , when the row component is remounted during scrolling
  useEffect(() => {
    getModifiedRowItem().then((row) =>
      setModifiedRow((currentRow) => ({ ...currentRow, ...row }))
    );
  }, []);

  //When the local state changes as part of form modification, we need to track the modified row
  //by placing it in the recoil state using the updateMofiedItems handler
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

  //Callback for updating the local state
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
