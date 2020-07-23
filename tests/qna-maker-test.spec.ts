#!/usr/bin/env ts-node

import test  from 'tstest'
import axios from 'axios'

const ENDPOINT = process.env.QNA_ENDPOINT
const KNOLEDGE_BASE_TOKEN = process.env.QNA_KNOWLEDGE_BASE_TOKEN

const url = `https://wechatyqnachinese.azurewebsites.net/qnamaker/knowledgebases/${KNOLEDGE_BASE_TOKEN}/generateAnswer`;
const headers = {
    'Authorization': `EndpointKey ${ENDPOINT}`,
    'Content-Type': 'application/json',
}

export interface TestData{
    question: string,
    qna_id: number
}

async function read_data(): Promise<Array<TestData>>{
    // load test_data from remote_url/local_file/db
    const test_data = [{
        question: "python-wechaty 怎么跑不起来啊",
        qna_id: 77,
    }, {
        question: "Token 有什么用？",
        qna_id: 40,
    }]
    return test_data
}

test('qna-maker ', async t => {
    let test_data = await read_data()
    for (const item of test_data) {
        const res = await axios.post(url, { question: item.question }, { headers })
        const answers: Array<object> = res.data.answers
        console.log(answers)
        // make sure the specific answer in response
        const target_answer = answers.filter(x => x['id'] == item.qna_id)
        t.assert(target_answer.length, 1)
    }
})