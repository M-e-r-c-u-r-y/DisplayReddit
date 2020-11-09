import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
});

// Redux starts here

// import { createStore } from "redux";
// // STORE -> GLOBALIZED STATE

// // ACTION INCREMENT

// const increment = () => {
//   return {
//     type: "INCREMENT",
//   };
// };

// const decrement = () => {
//   return {
//     type: "DECREMENT",
//   };
// };

// // REDUCER

// const counter = (state = 0, action) => {
//   switch (action.type) {
//     case "INCREMENT":
//       return state + 1;
//     case "DECREMENT":
//       return state - 1;
//     default:
//       return state;
//   }
// };

// let store = createStore(
//   counter,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// Redux ends here

// Reduxtoolkit starts here

// const initialState = [];

// const commentsStore = createSlice({
//   name: "commentsStore",
//   initialState: initialState,
//   reducers: {
//     addComments(state, action) {
//       state.push({ ...action.payload });
//     },
//     clearComments() {
//       return initialState;
//     },
//     completedComments(state, action) {
//       const { id } = action.payload;
//       return state.map((item) => {
//         if (item.id !== id) {
//           return item;
//         }
//         return {
//           ...item,
//           completed: true,
//         };
//       });
//     },
//   },
// });

// const store = configureStore({
//   reducer: {
//     // posts: postsStore.reducer,
//     comments: commentsStore.reducer,
//   },
// });

// //DISPLAY IN CONSOLE
// store.subscribe(() => console.log(store.getState()));

// store.dispatch(
//   commentsStore.actions.addComments({ id: 1, name: "abc", val: 5 })
// );
// store.dispatch(commentsStore.actions.addComments({ id: 2 }));
// store.dispatch(commentsStore.actions.completedComments({ id: 1 }));
// store.dispatch(commentsStore.actions.addComments({ id: 3 }));
// store.dispatch(commentsStore.actions.clearComments());
// store.dispatch(commentsStore.actions.addComments({ id: 4 }));
// store.dispatch(commentsStore.actions.addComments({ id: 1 }));
// store.dispatch(commentsStore.actions.addComments({ id: 2 }));
// store.dispatch(commentsStore.actions.completedComments({ id: 1 }));

// Reduxtoolkit ends here

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
