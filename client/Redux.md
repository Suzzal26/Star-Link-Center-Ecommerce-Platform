Bookmark

1. Add Bookmark
2. Delete Bookmark
3. Store bookmark in LS

4. Blogs fetch using useBlog Hook
5. Add bookmark function (LS store)
6. Delete bookmark function (LS remove)
7. Already bookmark, re add disable

Redux vs Context API (state manager)

<!-- {data:[], total: 10, page: 10, limit:10} -->

Redux toolkit + Zustand + Mobx (nested Data / data complex operations) => state manager => data reconciliation
// Old Data (L3)
{{ data: "raktim" }, {}},
// New Data
{{ data: "Raktim" }, {}}

Redux
state management package

redux => core state management library / centralized store/state
redux-thunk => state kunai pani actions implementation
redux-devtools-extension => console.log redux action track/ log
react-redux => store access library

// logically

// store
different data store from different slices (users/ blogs/ cart)

// slice

A => Action and action creator
D => Dispatch (action trigger that updates the central store)
R => Reducer (Complex data breakdown {logic})

redux => Store/ department(actions)
react-redux => dispatch(store bata data lina dina)

redux-persist => data permanently store
