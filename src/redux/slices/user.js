import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    age: 0,
    time: 0,
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        //To store the age of user
        setAge: (state, action) => {
            state.age = action.payload;
        },
        //To store the progress percentage of last played audio
        setTime: (state, action) => {
            state.time = action.payload;
        },
    },
});

export const { setAge, setTime } = userSlice.actions;

export const AgeAction = (age) => dispatch => {
    dispatch(setAge(age));
};

export const TimeAction = (time) => dispatch => {
    dispatch(setTime(time));
};

export default userSlice.reducer;