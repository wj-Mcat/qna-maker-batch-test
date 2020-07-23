#!/usr/bin/env ts-node

import test  from 'tstest'
const superagent = require('superagent')

let ENDPOINT = process.env.QNA_ENDPOINT
let KNOLEDGE_BASE_TOKEN = process.env.QNA_KNOWLEDGE_BASE_TOKEN

let agentPromise = superagent.
        post(`https://wechatyqnachinese.azurewebsites.net/qnamaker/knowledgebases/${KNOLEDGE_BASE_TOKEN}/generateAnswer`).
        set('Authorization', `EndpointKey ${ENDPOINT}`).
        set('Content-Type', 'application/json')

test('qna-maker ', async t => {
    // load test_data
    let test_data = [{"question": "python 怎么运行不起来", "qna_id": 77}]
    test_data.forEach(item => {
        agentPromise.send({question: item['question']}).then(res => {
            let answers = res.body.answers
            // make sure the specific answer in response
            let qna_ids = answers.filter(answer => answer['id'] == item['qna_id'])
            t.assert(qna_ids.length, 1)
        }).catch(console.error)
    });
})