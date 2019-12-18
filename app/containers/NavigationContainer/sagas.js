
import { REQUEST_TOPICS, SELECT_TOPIC, REQUEST_TOPICS_SUCCEEDED } from './constants'
import { requestTopicsSucceeded, requestTopicsFailed } from './actions';
import { takeLatest } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import navigationContainerSelector from './selectors'

export function fetchTopicsFromServer() {
  return fetch('http://localhost:3000/api/topics')
    .then(response => response.json())
}

export function* fetchTopics() {
  try {
    const topics = yield call(fetchTopicsFromServer);

    yield put(requestTopicsSucceeded(topics));
  } catch (message) {
    yield put(requestTopicsFailed(message))
  }
}
function* pushTopic(action) {
  yield put(push(`/topics/${action.topic.name}`))
}
export function* fetchTopicsSaga() {
  yield takeLatest(REQUEST_TOPICS, fetchTopics);
}

export function* selectTopicSaga() {
  yield takeLatest(SELECT_TOPIC, pushTopic);
}

export function* selectDefaultTopic() {
  const state = yield select(navigationContainerSelector())
  if (!state.selectedState) {
    yield put(push(`/topics/${state.topics[0].name}`))
  }
}
export function* selectDefaultTopicSaga() {
  yield takeLatest(REQUEST_TOPICS_SUCCEEDED, selectDefaultTopic)
}
// All sagas to be loaded
export default [
  fetchTopicsSaga,
  selectTopicSaga,
  selectDefaultTopicSaga
];
