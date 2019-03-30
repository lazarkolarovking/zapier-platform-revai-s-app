const {BASE_ITEM_URL, BASE_DOWNLOAD_URL} = require('../constants');
const fs = require('fs');

const createFile = (z, bundle) => {
  
  const id = bundle.inputData.m_id;

  const responsePromise = z.request({
    method: 'GET',
    url: `${BASE_ITEM_URL}/jobs/${id}`
  }); 

  const responseDetails = {
    id: '',
    status: '',
    text_content: '',
  };

  return responsePromise
    .then((response) => {
      const content = JSON.parse(response.content);

      z.console.log('++++ Step 1 ++++');

      responseDetails.id = content.id;
      responseDetails.status = content.status;

      if (responseDetails.status == 'transcribed') {

        const responsePromise_transcribed = z.request({
          method: 'GET',
          url: `${BASE_ITEM_URL}/jobs/${id}/transcript`,
          headers: {
            'Accept': 'text/plain'
          }
        });

        return responsePromise_transcribed
          .then((response) => {
            responseDetails.text_content = response.content;
            
            return responseDetails;
          })
      }

      return responseDetails;
    });
};

module.exports = {
  key: 'file',
  noun: 'File',

  // Will become a create on the app. Key will be `createFile`
  create: {
    display: {
      label: 'Check Transcribed',
      description: 'Check the transcription status.',
      important: true,
    },
    operation: {
      inputFields: [
        {
          key: 'access_token',
          type: 'string',
          label: 'Access Token',
          required: true,
          helpText: 'Must be a Access Token from Rev.ai.',
        },
        {
          key: 'm_id',
          type: 'string',
          label: 'ID',
          required: true,
          helpText: 'ID for checking transcription status of the file sent by Revai zap.'
        },
      ],
      perform: createFile,
    },
  },

  sample: {
    id: '1',
    status: 'transcribed',
    text_content: 'Example.txt',
    _path: '/Something/Example.jpg',
    _parent: '/Something',
    webUrl: 'http://example.com',
    createdDateTime: '2019-03-22T03:37:04.72Z',
    lastModifiedDateTime: '2019-03-22T03:37:04.72Z',
  },

  outputFields: [
    { key: 'id', label: 'ID' },
    { key: 'status', label: 'Status' },
    { key: 'text_content', label: 'Text Content' },
    { key: '_path', label: 'File Path' },
    { key: '_parent', label: 'Folder' },
    { key: 'webUrl', label: 'URL' },
  ],
};
