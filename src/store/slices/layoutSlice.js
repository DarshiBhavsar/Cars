import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sidebarShow: true,
    sidebarUnfoldable: false,
    theme: 'light',
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        setSidebarShow: (state, action) => {
            state.sidebarShow = action.payload;
        },
        setSidebarUnfoldable: (state, action) => {
            state.sidebarUnfoldable = action.payload;
        },
        setLayoutState: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setSidebarShow, setSidebarUnfoldable, setLayoutState } = layoutSlice.actions;
export default layoutSlice.reducer;
