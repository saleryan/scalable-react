import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga'
import { requestLinksSucceeded, requestLinksFailed } from './actions'
import { REQUEST_LINKS } from './constants'

function fetchLinksFromServer(topic) {
  return fetch(`http://localhost:3000/api/topics/${topic}/links`)
    .then(res => res.json())

}
// Individual exports for testing
export function* fetchLinks(action) {
  try {
    const links = yield call(fetchLinksFromServer, action.topicName);
    yield put(requestLinksSucceeded(links))
  } catch (ex) {
    yield put(requestLinksFailed(ex.message))
  }
}

export function* defaultSaga() {
  yield takeLatest(REQUEST_LINKS, fetchLinks)
}

// All sagas to be loaded
export default [
  defaultSaga,
];
