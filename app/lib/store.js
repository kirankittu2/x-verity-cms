const { configureStore } = require("@reduxjs/toolkit");
import popSlice from "./popSlice";

const store = configureStore({
  reducer: {
    popup: popSlice,
  },
});

export default store;
