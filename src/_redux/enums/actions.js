import {ERROR} from "../notification/actions";
import {FETCH_DB_ENUMS} from "../../constants";
import {fetchAPI} from "../../_core/http";
import {createAsyncAction} from "../actions";

const fetchDBEnums = createAsyncAction(FETCH_DB_ENUMS, function () {
  let url = 'enums';
  return (dispatch) => {
    return fetchAPI(url,{},{})
      .catch((err) => {
        dispatch(ERROR(...err.errors));
        dispatch(this.failed(err));
        throw err
      })
      .then((res) => {
        dispatch(this.success({data:res}));
        return res
      })
  }
});
export default {
  ...fetchDBEnums,
}
