import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { doc, Firestore, getDocs, getFirestore, Timestamp, updateDoc, collection, query, orderBy, addDoc } from 'firebase/firestore'

const initialState = {
  quizzes: [],

  docId: null,
  name: null,
  topic: null,
  description: null,
  lastTaken: null,
  creation: null,
  lastQuestionIndex: null,
  points: null,
}

const createQuiz = createAsyncThunk(
  'quiz/createQuiz',
  async({user, questions}, thunkAPI) => {
    const quizzesRef = collection(getFirestore(), 'users', user.docId, 'quizzes');
    const data = {
      name: "New Quiz",
      topic: "Topic Name",
      description: "A quiz about something!",
      lastTaken: Timestamp.now(),
      creation: Timestamp.now(),
      lastQuestionIndex: 0,
      points: 0,
    };

    const quizRef = await addDoc(quizzesRef, data);
    data.docId = quizRef.id;
    // Transform all Firestore Timestamps to strings
    data.lastTaken = data.lastTaken.toDate().toString();
    data.creation = data.creation.toDate().toString();
    return {data}
  }
)

const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async({user}, thunkAPI) => {
    try {
      if (user.docId) {
        const quizzesRef = collection(getFirestore(), 'users', user.docId, 'quizzes');
        const q = query(quizzesRef, orderBy('lastTaken', 'desc'));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;
        // Add docId to all quizzes and change Firestore Timestamps to strings
        const quizzes = docs.map((doc) => ({...doc.data(), ...{docId: doc.id}})).map((quiz) => { 
          quiz.lastTaken = quiz.lastTaken.toDate().toString();
          quiz.creation = quiz.creation.toDate().toString();
          return quiz
        });

        console.log("quizzes: ", quizzes);
        return {quizzes}
      }

      return {quizzes: []}
    } catch(error) {
      console.log(error);
    }
  }
)

const deleteQuiz = createAsyncThunk(
  'quiz/deleteQuiz',
  async({user, quiz}, thunkAPI) => {

  }
)

const updateLastTaken = createAsyncThunk(
  'quiz/updateLastTaken',
  async({user, quiz}, thunkAPI) => {
    try {
      const quizRef = doc(getFirestore(), 'users', user.docId, 'quizzes', quiz.docId);
      const lastTaken = Timestamp.now();
      await updateDoc(quizRef, { lastTaken });
      return { lastTaken: lastTaken.toDate().toString()}

    } catch(error) {
      console.log(error);
    }
  }
)

const resetProgress = createAsyncThunk(
  'quiz/resetProgress',
  async({ user, quiz }, thunkAPI) => {
    try {
      const quizRef = doc(getFirestore(), 'users', user.docId, 'quizzes', quiz.docId);
      await updateDoc(quizRef, {
        lastQuestionIndex: 0,
        points: 0,
      });
      return
    } catch(error) {
      console.log(error);
    }
  }
)

const updateProgress = createAsyncThunk(
  'quiz/updateProgress',
  async({ user, quiz, questions, isCorrect}, thunkAPI) => {
    try {
      const quizRef = doc(getFirestore(), 'users', user.docId, 'quizzes', quiz.docId);
      await updateDoc(quizRef, {
        lastQuestionIndex: (
          quiz.lastQuestionIndex < questions.length - 1
          ? quiz.lastQuestionIndex + 1
          : 0 // Reset if the end is reached
          ),
        points: isCorrect ? quiz.points + 1 : quiz.points,
      });
      return { isCorrect }
    } catch(error) {
      console.log(error)
    }
  }
)

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // Load a selected quiz
    loadQuiz: (state, action) => {
      state = Object.assign(state, action.payload);
    },
 
    // Update name, topic, and description
    updateDescriptors: () => {},
    // Update lastQuestionIndex and points
    updateProgressIdentifiers: () => {},
    // Add questions to the quiz
    addQuestions: (state, action) => { state.questions = [...state.questions, action.payload] },

    // Clear the currently stored quiz
    clearQuiz: (state) => {
      state = initialState
    },

  },

  extraReducers: (builder) => {
    
    builder.addCase(updateProgress.fulfilled, (state, action) => {
      state.lastQuestionIndex = state.lastQuestionIndex + 1;
      state.points = action.payload.isCorrect ? state.points + 1 : state.points;
    })

    builder.addCase(resetProgress.fulfilled, (state) => {
      state.lastQuestionIndex = 0;
      state.points = 0;
    })

    builder.addCase(updateLastTaken.fulfilled, (state, action) => {
      state.lastTaken = action.payload.lastTaken
    })

    builder.addCase(fetchQuizzes.fulfilled, (state, action) => {
      console.log('action.payload.quizzes', action.payload.quizzes);
      state.quizzes = action.payload.quizzes
    })

    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.docId = action.payload.data.docId;
      state.name = action.payload.data.name;
      state.topic = action.payload.data.topic;
      state.description = action.payload.data.description;
      state.lastTaken = action.payload.data.lastTaken;
      state.creation = action.payload.data.creation;
      state.lastQuestionIndex = action.payload.data.lastQuestionIndex;
      state.points = action.payload.data.points;

      state.quizzes.push(action.payload.data);
    })
  }
})

export const { 
  loadQuiz, 
  updateName, 
  updateTopic, 
  updateDescription, 
  addQuestions,
  clearQuiz
} = quizSlice.actions;

export { updateProgress, resetProgress, updateLastTaken, fetchQuizzes, createQuiz }

export default quizSlice.reducer;