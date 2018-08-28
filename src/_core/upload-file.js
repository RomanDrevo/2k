export const uploadFile = ({
  file, url, progressCallback, doneCallback, errorCallback
}) => {
  const xhr = new XMLHttpRequest()
  xhr.open('PUT', url, true)

  /*
  if (progressCallback && typeof progressCallback === 'function') {

  }
*/
  xhr.upload.addEventListener('progress', progressCallback)
  xhr.upload.addEventListener('load', doneCallback)
  xhr.upload.addEventListener('error', errorCallback)

  xhr.send(file)
}

export default {
  uploadFile
}
