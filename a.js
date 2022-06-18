var $ = new Env('掘金自用');
var notify = {}, fetch = {},jwt = {}, token = {}, outTimer = null, bStart, global = {};
notify= $.isNode() ? require('./sendNotify') : '';
fetch= require('node-fetch')
jwt= require('jsonwebtoken');
const dayjs = require('dayjs')
// const { faker } = require('@faker-js/faker')
const locale = ['af_ZA', 'ar', 'az', 'cz', 'de', 'de_AT', 'de_CH', 'el', 'en', 'en_AU', 'en_AU_ocker', 'en_BORK', 'en_CA', 'en_GB', 'en_GH', 'en_IE', 'en_IND', 'en_NG', 'en_US', 'en_ZA', 'es', 'es_MX', 'fa', 'fi', 'fr', 'fr_BE', 'fr_CA', 'fr_CH', 'ge', 'he', 'hr', 'hy', 'id_ID', 'it', 'ja', 'ko', 'lv', 'mk', 'nb_NO', 'ne', 'nl', 'nl_BE', 'pl', 'pt_BR', 'pt_PT', 'ro', 'ru', 'sk', 'sv', 'tr', 'uk', 'ur', 'vi', 'zh_CN', 'zh_TW', 'zu_ZA']
// md5token= require('md5webtoken')

const aid = 2608
const xMcsppkey = "566f58151b0ed37e"
const msg = []
let mainId = null
let dayiyMsg = null
const msgId = []
if (process.env.MAIN_ID) {
    mainId = process.env.MAIN_ID
}

let runMain = true
if (process.env.RUN_MAIN) {
    runMain = false
}

let parallelism = true
if (process.env.NO_PARALLELISM) {
    parallelism = false
}

let commentId = ""
if (process.env.COMMENT_ID) {
    $.name = '掘金签到-回复沸点'
    commentId = process.env.COMMENT_ID
}

let commentContent = ""
if (process.env.COMMENT_CONTENT) {
    commentContent = process.env.COMMENT_CONTENT
}

let canJoinBugFixIndex = 15
if (process.env.BUG_FIX_INDEX) {
    canJoinBugFixIndex = Number(process.env.BUG_FIX_INDEX) || 15
}

let canJoinBugFix = false
if (process.env.BUG_FIX_RACE) {
    canJoinBugFix = process.env.BUG_FIX_RACE || false
    $.name = '掘金签到-bugfix参赛'
}

let canCheckMessage = false
if (process.env.CHECK_MESSAGE) {
    canCheckMessage = process.env.CHECK_MESSAGE || false
    $.name = '掘金签到-系统消息'
}
let suoha = false
if (process.env.SUOHA) {
    suoha = process.env.SUOHA || false
    $.name = '掘金签到-梭哈'
}
let suohaStartIndex = 20
if (process.env.SUOHA_START_INDEX) {
    suohaStartIndex = process.env.SUOHA_START_INDEX || 1
}

let canCheckGift = false
if (process.env.CHECK_GIFT) {
    canCheckGift = process.env.CHECK_GIFT || false
    $.name = '掘金签到-未收取礼物信息'
}

let bugFixCollect = false
if (process.env.BUG_FIX_COLLECT) {
    bugFixCollect = process.env.BUG_FIX_COLLECT || false
    $.name = '掘金签到-收集bug'
}


let sendPost = false
if (process.env.SEND_POST) {
    sendPost = process.env.SEND_POST || false
    $.name = '掘金签到-发送沸点'
}

// 参与的话题id
let themeId = ''
if (process.env.THEMEID) {
    let themeIdenv = process.env.THEMEID.split('@')
    if (themeIdenv.length > 1) {
            themeIdenv[0] = themeIdenv[Math.floor(Math.random() * (themeIdenv.length))]
    }
    themeId = !themeIdenv[0] ? '' : themeIdenv[0] + ""
}

function getThemeId () {
    let themeId = ''
    if (process.env.THEMEID) {
        let themeIdenv = process.env.THEMEID.split('@')
        if (themeIdenv.length > 1) {
                themeIdenv[0] = themeIdenv[Math.floor(Math.random() * (themeIdenv.length))]
        }
        themeId = !themeIdenv[0] ? '' : themeIdenv[0] + ""
    }
    return themeId
}

let sendPostContentUrl = ''
if (process.env.SEND_POST_CONTENT_URL) {
    sendPostContentUrl = process.env.SEND_POST_CONTENT_URL
}
// let topicId = '6824710202734936077'
// 6824710203112423437
// 6824710203464761352
// 参与的圈子id
let topicId = ''
if (process.env.TOPICID) {
    let topicIdenv = process.env.TOPICID.split('@')
    if (topicIdenv.length > 1) {
            topicIdenv[0] = topicIdenv[Math.floor(Math.random() * (topicIdenv.length))]
    }
    topicId = !topicIdenv[0] ? '' : topicIdenv[0] + ""
}

function getTopicId () {
    let topicId = ''
    if (process.env.TOPICID) {
        let topicIdenv = process.env.TOPICID.split('@')
        if (topicIdenv.length > 1) {
                topicIdenv[0] = topicIdenv[Math.floor(Math.random() * (topicIdenv.length))]
        }
        topicId = !topicIdenv[0] ? '' : topicIdenv[0] + ""
    }
    return topicId
}

let sendPostEnd = '2028-12-30'
if (process.env.SEND_POST_END_TIME) {
    sendPostEnd = process.env.SEND_POST_END_TIME
}

let startIndex = 0
if (process.env.START_INDEX) {
    startIndex = Number(process.env.START_INDEX)
    if (typeof startIndex !== 'number') {
        startIndex = 0
    }
}

let api_ci = ''
if (process.env.API_CI) {
    api_ci = process.env.API_CI
}

let bugfixmax = 0
let bugfixnow = 0
if (process.env.BUG_FIX_MAX) {
    bugfixmax = Number(process.env.BUG_FIX_MAX) || 0
    if (typeof bugfixmax !== 'number') {
        bugfixmax = 0
    }
}

let canSendPostId = []
if (process.env.CAN_SEND_POST_ID) {
    canSendPostId = process.env.CAN_SEND_POST_ID.split(',').filter(i => i)
}
let zanId = ''
if (process.env.ZAN_ID) {
    zanId = process.env.ZAN_ID
}

let endIndex = 9999999
if (process.env.END_INDEX) {
    endIndex = Number(process.env.END_INDEX)
}

let canSendPostIdFinish = 0
juejinCookie = []
process.env.JUEJIN_COOKIE = 'https://c.jiangwenqiang.com/api/juejinCookie4.json'
// juejinCookie = require('./juejinCookie3.js')
const daymsg = []
const objCheck = []
let AllStart = new Date().getTime()


let processExitTimer = null

function processExit () {
        // processExitTimer && clearTimeout(processExitTimer)
        // processExitTimer = setTimeout(async () => {
        //     notify && notify.sendNotify('终止脚本', msg.toString());
        //     log('程序超时4分钟无新循环，终止程序')
        //     await mathWait()
        //     process.exit(0)
        // }, 1000 * 60 * 4)
}

let postid= []
let cursor = "0"
let total = 0

// let count = 0
!(async () => {
    bStart = new Date().getTime()
    
    juejinCookie = await getCookie()
    if (juejinCookie.length) {
        timeCount()
    }
juejinCookie = juejinCookie.sort((a,b) => Math.random() > 0.5)
    for (let i = startIndex; i < juejinCookie.length; i++) {
        // if (count >= 5) {
        //     process.exit(0)
        // }
        if (i >= endIndex) {
            notify && notify.sendNotify(`执行${startIndex}到${endIndex}结束`, msg.toString());
            await mathWait()
            process.exit(0)
        }
        processExit()
        if (canSendPostIdFinish >= canSendPostId.length && canSendPostId.length > 0) {
            return
        }
        if (canSendPostIdFinish >= 13) {
            return
        }
        // if (i % 4 === 0 && i !== 0 && !canCheckMessage && !canCheckGift) {
        //     await mathWait(45000)
        // }
        let fuck_jue = new JueJin(juejinCookie[i], i)
        objCheck.push(fuck_jue)
        await fuck_jue.init()
        await mathWait(3000)
        if (!fuck_jue.cookieOk) {
            log(`账号${fuck_jue.index}的cookie有问题`)
            continue
        }
        if (!fuck_jue.ok) {
            log(`账号${fuck_jue.index}的已失效`)
            continue
        }
        if (!fuck_jue.job_title) {
            log(`账号${fuck_jue.index}更新用户信息`)
            // randomChinese()
            await fuck_jue.setUserInfo()
            await mathWait(3000)
        }
            if (!postid.length) {
                    while(postid.length < total || total == 0) {
                let s = await fetch("https://api.juejin.cn/content_api/v1/article/query_list" + fuck_jue.url_fix, {
          "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cookie": fuck_jue.cookie
          },
          "referrer": "https://juejin.cn/",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": JSON.stringify({
          "user_id": "3615671881575853",
          "sort_type": 2,
          "cursor": cursor
        }),
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
            s=await s.json()
            total = s.count
            cursor = s.cursor

            s.data && s.data.map(i=> postid.push(i.article_id))
            
            }
            }
                    postid = Array.from(new Set(postid))
        postid = postid.sort((a,b) => Math.random() > 0.5)
                console.log(postid)
                for (let v of postid) {
                        await fuck_jue.zanArticle(v)
                        await $.wait(1000)
                }
        continue
        // let ss = await fetch("https://api.juejin.cn/interact_api/v1/digg/save" + fuck_jue.url_fix, {
        //   "headers": {
        //     "accept": "*/*",
        //     "accept-language": "zh-CN,zh;q=0.9",
        //     "content-type": "application/json",
        //     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
        //     "sec-ch-ua-mobile": "?0",
        //     "sec-ch-ua-platform": "\"Windows\"",
        //     "sec-fetch-dest": "empty",
        //     "sec-fetch-mode": "cors",
        //     "sec-fetch-site": "same-site",
        //     "cookie": fuck_jue.cookie
        //   },
        //   "referrer": "https://juejin.cn/",
        //   "referrerPolicy": "strict-origin-when-cross-origin",
        //   "body": "{\"item_id\":\"7110033715559923720\",\"item_type\":2,\"client_type\":2608}",
        //   "method": "POST",
        //   "mode": "cors",
        //   "credentials": "include"
        // });
        // ss = await ss.json()
        // console.log(ss)
        // continue
        // let asd = [

        //     '羡慕老哥呀',
        //     '挺好的，像爸爸一样',
        //     '给我整破防了,老哥不带这样的',
        //     '给你点个赞，梦想实现了'
        // ]
        // count++
        // console.log(ms[fuck_jue.index])
        // console.log(fuck_jue)
        // return
//         let data = await fetch("https://juejin.cn/game/chengxuyuantujian/api/invoke/getStones", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "zh-CN,zh;q=0.9",
//     "content-type": "application/json",
//     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site",
//     "cookie": fuck_jue.cookie
//   },
//   "referrer": "https://juejin.cn/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": JSON.stringify({
//     uid: fuck_jue.userId,
//     name: ''
//   }),
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });

//         data =await data.json()

//         console.log(data)
//         await $.wait(50000)
//         continue

        // await fuck_jue.setUserInfo()
        // fuck_jue.joinFeiDian()
//         console.log(fuck_jue.index)
//         let res = await fetch("https://api.juejin.cn/content_api/v1/short_msg/delete" + fuck_jue.url_fix, {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "zh-CN,zh;q=0.9",
//     "content-type": "application/json",
//     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site",
//     "cookie": fuck_jue.cookie
//   },
//   "referrer": "https://juejin.cn/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": JSON.stringify({
//     // "msg_id": String(deleid[fuck_jue.index])
//     "msg_id": "7096731630198325279"
//   }),
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });
// 
// let data = await fetch(`https://api.juejin.cn/interact_api/v1/digg/save${fuck_jue.url_fix}`, {
//               "headers": {
//                 "accept": "*/*",
//                 "accept-language": "zh-CN,zh;q=0.9",
//                 "content-type": "application/json",
//                 "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
//                 "sec-ch-ua-mobile": "?0",
//                 "sec-ch-ua-platform": "\"Windows\"",
//                 "sec-fetch-dest": "empty",
//                 "sec-fetch-mode": "cors",
//                 "sec-fetch-site": "same-site",
//                 "cookie": fuck_jue.cookie
//               },
//               "referrer": "https://juejin.cn/",
//               "referrerPolicy": "strict-origin-when-cross-origin",
//               "body": JSON.stringify({
//                     "item_id": "7100166078277517326",
//                     "item_type": 2,
//                     "client_type": aid
//                 }),
//               "method": "POST",
//               "mode": "cors",
//               "credentials": "include"
//             });
//             data = await data.json()
//             log(data)
//             await mathWait(6000)
//             continue

        // await fuck_jue.sendActivityPost()
        // // await fuck_jue.publishComment()
        // await mathWait(30000)
        // if (fuck_jue.index >= 11) {
        //     process.exit(0)
        // }
        // continue
//         let data = await fetch("https://api.juejin.cn/interact_api/v1/comment/publish" + fuck_jue.url_fix, {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "zh-CN,zh;q=0.9",
//     "content-type": "application/json",
//     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site",
//     "cookie": fuck_jue.cookie
//   },
//   "referrer": "https://juejin.cn/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\"item_id\":\"7096411376515547150\",\"item_type\":4,\"comment_content\":\"我要加入JUEJIN FRIENDS 晒周边计划\",\"comment_pics\":[],\"client_type\":2608}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });
//         data = await data.json()
//         console.log(data)
        // continue
        // 
        // if (fuck_jue.index < canJoinBugFixIndex) {
        //     await fuck_jue.bugfix()
        //     msg[fuck_jue.index] = fuck_jue.msg.toString()
        //     fuck_jue.finish = true
        //     return
        // }
        // await fuck_jue.juejinLottery()
        // await fuck_jue.bugfix_index()
        // await fuck_jue.bugfix_competition()   
        // let bugNum = await fuck_jue.bugfix_user()
        // log(`账号${fuck_jue.index}有${bugNum}个bug`)
        // if (this.index >= 1 && mainId && this.bugfix_joinRace && bugNum >= 1 && bugfixnow < bugfixmax) {
        //     await mathWait()
        //     if (bugfixmax - bugfixnow < bugNum) {
        //         bugNum = bugfixmax - bugfixnow
        //     }
            
        // } else {
        //     this.msg.push(`账号${this.index}有${bugNum}个bug\n`)
        // }
        // fuck_jue.bugfix_fix(bugNum)
        // await fuck_jue.bugfix()


                // let count = await fuck_jue.get_cur_point()
                // while(count > 2000) {
                //     count -= 2000
                //     await fuck_jue.juejinLottery(false)
                //     await mathWait()
                // }
                // await mathWait()
                // count = await fuck_jue.get_cur_point()
                // while(count > 2000) {
                //     count -= 2000
                //     await fuck_jue.juejinLottery(false)
                //     await mathWait()
                // }
                // await mathWait()
                // count = await fuck_jue.get_cur_point()
                // while (count >= 200) {
                //     count -= 200
                //     await fuck_jue.juejinLottery()
                //     await mathWait()
                // }
                // await mathWait()
                // count = await fuck_jue.get_cur_point()
                // while (count >= 200) {
                //     count -= 200
                //     await fuck_jue.juejinLottery()
                //     await mathWait()
                // }
                // // fuck_jue.finish = true
                // process.exit(0)

        if (zanId) {
            let data = await fetch(`https://api.juejin.cn/interact_api/v1/digg/save${fuck_jue.url_fix}`, {
              "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": fuck_jue.cookie
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": JSON.stringify({
                    "item_id": zanId,
                    "item_type": 4,
                    "client_type": aid
                }),
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
            data = await data.json()
            log(data)
            await mathWait(6000)
            continue
        }
        if (sendPost) {
            canSendPostIdFinish += 1
            if (new Date().getTime() > new Date(sendPostEnd).getTime() || !sendPostContentUrl) {
                log('发送沸点超过时间或者内容url未填写')
                fuck_jue.finish=true 
                return
            }
            await mathWait(3000)
            await mysendPost(fuck_jue)
            continue
        }
        if (commentId) {
            await mathWait(5000)
            await fuck_jue.publishComment()
            continue
        }
        // 所有任务触发区域
        try {
            if (suoha) {
                if (i < suohaStartIndex) {
                    fuck_jue.finish = true
                    continue
                }
                let count = await fuck_jue.get_cur_point()
                while(count > 2000) {
                    count -= 2000
                    await fuck_jue.juejinLottery(false)
                    await mathWait()
                }
                await mathWait()
                count = await fuck_jue.get_cur_point()
                while(count > 2000) {
                    count -= 2000
                    await fuck_jue.juejinLottery(false)
                    await mathWait()
                }
                await mathWait()
                count = await fuck_jue.get_cur_point()
                while (count >= 200) {
                    count -= 200
                    await fuck_jue.juejinLottery()
                    await mathWait()
                }
                await mathWait()
                count = await fuck_jue.get_cur_point()
                while (count >= 200) {
                    count -= 200
                    await fuck_jue.juejinLottery()
                    await mathWait()
                }
                await mathWait()
                await mathWait(3000)
                fuck_jue.finish = true
                continue
            }
            if (canJoinBugFix) {
                if (parallelism) {
                    joinBugFixRace(fuck_jue)    
                } else {
                    await joinBugFixRace(fuck_jue)
                }
                await mathWait(3000)
            }
            if (bugFixCollect) {
                if (parallelism) {
                    onlyBugFix(fuck_jue)    
                } else {
                    await onlyBugFix(fuck_jue)
                }
                await mathWait()
            }
            if (canCheckMessage) {
                if (parallelism) {
                    chekcMessageAll(fuck_jue)    
                } else {
                    await chekcMessageAll(fuck_jue)
                }
                await mathWait(3000)
            }

            if (canCheckGift) {
                if (parallelism) {
                    checkGiftAll(fuck_jue)    
                } else {
                    await checkGiftAll(fuck_jue)
                }
                await mathWait(3000)
            }
            if (runMain) {
                // if (parallelism) {
                //     runMisison(fuck_jue)    
                // } else {
                //     await runMisison(fuck_jue)
                // }
                await runMisison(fuck_jue)
                await mathWait(3000)
            }
        } catch (e) {
            log('执行出错了', e)
            continue
        }
    }
})().catch(e => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
    checkAllFinish()
})


async function checkAllFinish () {
    let again = false
    for (let i = 0; i < objCheck.length; i++) {
        if (!objCheck[i].finish) {
            again = true
            break
        }
    }
    if (again) {
        await $.wait(1000)    
        return checkAllFinish()
    } else {
        log(`总计运行耗时${(new Date().getTime() - AllStart) / 1000}秒`)
        clearInterval(outTimer)
        notify && notify.sendNotify($.name, msg.toString());
    }
}

const dayMsgArr = [
    '一朝耍流氓，十年挂南墙；不乖的孩子统统都要打屁股；越狱是不可能越狱的，这辈子是不可能越狱的。'
]

async function mysendPost (fuck_jue) {
    if (fuck_jue.phone && fuck_jue.phone_verified === 1 && (canSendPostId.includes(fuck_jue.userId) || canSendPostId.length === 0)) {
        await mathWait(10000)
        let tag = true
        dayiyMsg = null
        while(tag) {
            if (!dayiyMsg || typeof dayiyMsg !== 'string') {
                try {
                    // return fetch(`https://www.51wnl.com/Api4.3.3/GetSentenceByDate.ashx?date=${dayjs().subtract(this.index, "month").format("YYYY-MM-DD")}&cc=cn`).then(res => res.json().then(res => Promise.resolve(res.data.s)))
                    let contentFunc = new Function(sendPostContentUrl)
                    // dayiyMsg = await fetch(`${sendPostContentUrl}`)
                    // dayiyMsg = await fetch(`https://www.51wnl.com/Api4.3.3/GetSentenceByDate.ashx?date=${dayjs().subtract(this.index, 'month').format('YYYY-MM-DD')}&cc=cn`)
                    // dayiyMsg = await dayiyMsg.json()
                    dayiyMsg = await contentFunc.apply({
                        ...fuck_jue,
                        fetch,
                        dayjs
                    })
                    if (dayMsgArr.includes(dayiyMsg)) { 
                        // 继续循环
                        tag = true
                        dayiyMsg = null
                    } else {
                        dayMsgArr.push(dayiyMsg)
                        tag = false
                    }
                } catch (e) {
                    log('sendPostContentUrl获取失败', e)
                }
            } else {
                tag = false
            }
        }
        log(dayMsgArr)
        let content = dayiyMsg
        // while (!content) {
        //     content = dayiyMsg.content[Math.floor(Math.random() * dayiyMsg.content.length)]
        // }

        let pic = null
        // pic = dayiyMsg.img[Math.floor(Math.random() * dayiyMsg.img.length)]
        
        await fuck_jue.sendActivityPost(getThemeId(), getTopicId(), content, pic ? [pic] : '')
        fuck_jue.msg.push(`账号${fuck_jue.index}发送沸点成功，内容为：${content}\n`)
        await mathWait(20000)
        msg[fuck_jue.index] = fuck_jue.msg.toString()
    }
    fuck_jue.finish = true
}




async function getCookie () {
    if (process.env.JUEJIN_COOKIE) {
        var JUEJIN_COOKIE = process.env.JUEJIN_COOKIE
    }
    if (JUEJIN_COOKIE) {
        if (JUEJIN_COOKIE.indexOf('&') > -1) {
            log(`从环境变量中获取cookie,你的方式为使用【&】连接符号做区分`)
            return JUEJIN_COOKIE.split('&')
        } else if (JUEJIN_COOKIE.indexOf('\n') > -1) {
            log(`从环境变量中获取cookie,你的方式为使用【换行】做区分`)
            return JUEJIN_COOKIE.split('\n')
        } else if (JUEJIN_COOKIE.indexOf('http') > -1) {
            log(`从${JUEJIN_COOKIE}远程获取cookie`)
            let data = await fetch(JUEJIN_COOKIE)
            data = await data.json()
            return data
        } else {
            log('你使用的是本地Cookie')
            return juejinCookie
        }
    } else {
        log('你使用的是本地Cookie')
        return juejinCookie
    }
}
function timeCount () {
    outTimer = setInterval(async () => {
        // 29分钟签到超时
        if (new Date().getTime() - bStart >= (1000 * 60 * 30 - 8000)) {
           clearInterval(outTimer)
           api_ci && sendci()
           notify && notify.sendNotify('掘金签到-脚本29分钟信息', msg.toString());
           bStart = new Date().getTime()
           timeCount()
        }
    }, 300)
}

function sendci () {
    log('触发ci api')
    let sortIndex = []
    for (let i = 0; i < objCheck.length; i++) {
        if (objCheck[i].finish) {
            sortIndex.push(i)
        }
    }
    log('sortIndex', sortIndex)
    let max = sortIndex[sortIndex.length - 1] || objCheck.length - 4
    if (max <= 0 || !max || typeof max !== 'number') {
        max = (new Date().getDay() >= 6 || new Date().getDay() <= 0) ? 50 : 79
    }
    log('max', max)
    api_ci = api_ci.replace(`"name": "START_INDEX","value": "0"`, `"name": "START_INDEX","value": "${max}"`)
    eval(api_ci)
    notify && notify.sendNotify('掘金签到-触发api', api_ci);
}

function randomAccess (min,max) {return Math.floor(Math.random() * (min - max) + max)}
function decodeUnicode (str) {str = "\\u"+str; str = str.replace(/\\/g, '%'); str = unescape(str); str = str.replace(/%/g, "\\"); return str}
function randomChinese() {
    return decodeUnicode(randomAccess(0x4e00, 0x9fa5).toString(16))
}
function log (...args) {
   console.log(...args)
}
async function mathWait (min = 2000) {
    let time = Math.floor(Math.random() * 3000 + min)
    await $.wait(time)
}

async function runMisison (fuck_jue) {
    log(`账号${fuck_jue.index} run day mission`)
    await fuck_jue.daytask()
    fuck_jue.finish = true
    msg[fuck_jue.index] = fuck_jue.msg.toString()
    log('\x1B[31m%s\x1B[0m', `账号${fuck_jue.index}运行耗时: ${(new Date().getTime() - fuck_jue.startTime) / 1000}秒`)
}

async function joinBugFixRace (fuck_jue) {
    if (fuck_jue.index < canJoinBugFixIndex) {
        await fuck_jue.bugfix()
        msg[fuck_jue.index] = fuck_jue.msg.toString()
        fuck_jue.finish = true
        return
    }
    let count = await fuck_jue.get_cur_point()
    let tag = false
    while(count > 2000) {
        tag = true
        count -= 2000
        await fuck_jue.juejinLottery(false)
        await mathWait()
    }
    tag && (count = await fuck_jue.get_cur_point())
    while(count > 200) {
        count -= 200
        await fuck_jue.juejinLottery()
        await mathWait()
    }
    await mathWait()
    await fuck_jue.bugfix()
    msg[fuck_jue.index] = fuck_jue.msg.toString()
    fuck_jue.finish = true
}

async function onlyBugFix (fuck_jue) {
    await fuck_jue.bugfix()
    msg[fuck_jue.index] = fuck_jue.msg.toString()
    fuck_jue.finish = true
}

async function chekcMessageAll (fuck_jue) {
    await fuck_jue.getMessage()
    msg[fuck_jue.index] = fuck_jue.msg.toString()
    fuck_jue.finish = true
}

async function checkGiftAll (fuck_jue) {
    await fuck_jue.checkGift()
    msg[fuck_jue.index] = fuck_jue.msg.toString()
    fuck_jue.finish = true
}

class JueJin {
    constructor(cookie, index) {
        this.cookie = cookie
        this.msg = []
        this.aid = aid
        this.index = index
        this.sign = false
        this.game_over = false
        this.ok = false
        this.startTime = new Date().getTime()
        this.level = 0
    }
    async init () {
        let next = this.cookieCheckAndInit()
        if (next) {
            // todo del
            // this.md5webToken()
            await this.getTodaySignStatus(true)
            await this.getUserInfo()
        } else {
            this.ok = false
        }
    }
    // 沸点回复
    async publishComment () {
        let data = await fetch("https://api.juejin.cn/interact_api/v1/comment/publish" + this.url_fix, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "application/json",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "cookie": this.cookie
                },
                "referrer": "https://juejin.cn/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": JSON.stringify({
                    "item_id": "7096832887252582413",
                    "item_type": 4,
                    "comment_content": "哈哈，鼠标垫这波在天上",
                    "comment_pics": [],
                    "client_type": 2608
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
                });
                data = await data.json()
                log('commentPublish', data)
    }
    // 关注用户
    async followUser (followUserInfo) {
        if (this.index < 1 || followUserInfo.author_user_info.isfollowed || new Date().getDay() % 2 > 0) {
            return
        }
        await mathWait(3000)
        await fetch("https://api.juejin.cn/interact_api/v1/follow/do" + this.url_fix, {
          "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cookie": this.cookie
          },
          "referrer": "https://juejin.cn/",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": JSON.stringify({
            "id": followUserInfo.author_user_info.user_id,
            "type": 1
          }),
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
    }
    async getUserInfo () {
        let data = await fetch("https://api.juejin.cn/user_api/v1/user/get", {
              "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": this.cookie
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": null,
              "method": "GET",
              "mode": "cors",
              "credentials": "include"
            });
        data = await data.json()
        if(data.data) {
            this.level = data.data.level
            this.job_title = data.data.job_title
            this.phone = data.data.phone
            this.phone_verified = data.data.phone_verified
            this.userId = data.data.user_id
            // console.log(data.data)    
        }
    }
    async joinFeiDian () {
        let data = await fetch("https://api.juejin.cn/interact_api/v1/follow/do" + this.url_fix, {
              "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": this.cookie
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": "{\"id\":\"7091610245012815879\",\"type\":11}",
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
        data = await data.json()
        console.log(data)
    }
    async sendActivityPost (theme_id, topic_id, content, pic_list) {
        const {t: contentArr, p: imgarr} = daymsg[String(new Date().getDate())]
        let data = await fetch("https://api.juejin.cn/content_api/v1/short_msg/publish" + this.url_fix, {
                      "headers": {
                        "accept": "*/*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "content-type": "application/json",
                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "cookie": this.cookie
                      },
                      "referrer": "https://juejin.cn/",
                      "referrerPolicy": "strict-origin-when-cross-origin",
                      // "body": JSON.stringify(Object.assign({
                      //    "content": `${themeId} ${content}`,
                      //    "sync_to_org": false,
                      // }, themeId ? {"theme_id": themeId.match(/\d+/)[0] + ''} : {}, pic_list ? {"pic_list": pic_list} : {}, topic_id ? {"topic_id": topic_id,}: {})),
                      "body": JSON.stringify({
                         // "content": '[7083312927725322240#这神转折真掘了#] ' + contentArr[this.index],
                         "content": '[7098697230017626149#JUEJIN FRIENDS 告白计划#] ' + contentArr[this.index],
                         "sync_to_org": false,
                         "pic_list": imgarr[this.index] ? [imgarr[this.index]] : undefined,
                         // "pic_list": [
                         //    'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b82a04b98c8448fc877f2de6e985f59e~tplv-k3u1fbpfcp-watermark.image?'
                         // ],
                         "theme_id": '7098697230017626149',
                         // topic_id: "7091610245012815879"
                      }),
                      "method": "POST",
                      "mode": "cors",
                      "credentials": "include"
                    });
        data = await data.json()
        msgId.push(data.data.msg_id)
        log('send_post', data)
        await $.wait(10000)
    }
    async zanFeiDian () {
        if (Math.random() > 0.5) {
            return
        }
        let data = await fetch(`https://api.juejin.cn/recommend_api/v1/short_msg/recommend${this.url_fix}`, {
              "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": this.cookie
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": "{\"id_type\":4,\"sort_type\":300,\"cursor\":\"0\",\"limit\":200}",
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
        data = await data.json()
        data = data.data
        await mathWait()
        let shortMsg = data[Math.floor(Math.random() * (data.length - 2))]
        let { id, digg_count } = shortMsg
        let followUserInfo = data[Math.floor(Math.random() * (data.length - 2))]
        if (followUserInfo) {
            await this.followUser(followUserInfo)
        }
        if (!id || digg_count <= 1) return
        await fetch(`https://api.juejin.cn/interact_api/v1/digg/save${this.url_fix}`, {
              "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": this.cookie
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": JSON.stringify({
                    "item_id": id,
                    "item_type": 4,
                    "client_type": aid
                }),
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
        
    }
    async checkGift () {
        const res = await fetch(`https://api.juejin.cn/growth_api/v1/lottery_history/obj_by_page${this.url_fix}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cookie": this.cookie
        },
        "referrer": "https://juejin.cn/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"page_no\":1,\"got_channel\":\"1\"}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
        });
        const data = await res.json()
        log('check_gift', data.data)
        let gifts = []
        try {
            data.data.lottery_histories.map(i => {
            if (!i.receive_name) {
                gifts.push(i.lottery_name) 
            }
        })
        } catch(e) {}
        if (gifts && gifts.length) {
            this.msg.push(`账号${this.index}未领取奖品:${gifts.join(',')}`)
        }
        
    }

    async getMessage () {
        try {
            const data = await fetch(`https://api.juejin.cn/interact_api/v1/message/get_message${this.url_fix}`, {
              "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": this.cookie
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": "{\"message_type\":4,\"cursor\":\"0\",\"limit\":50,\"aid\":2608}",
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
                const s = await data.json()
                if (s.data && s.data[0]) {
                        await fetch(`https://api.juejin.cn/interact_api/v1/message/set_all_read${this.url_fix}`, {
                  "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "application/json",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "cookie": this.cookie
                  },
                  "referrer": "https://juejin.cn/",
                  "referrerPolicy": "strict-origin-when-cross-origin",
                  "body": JSON.stringify({
                      "message_type": 4,
                      "latest_id": s.data[0].message.id
                    }),
                  "method": "POST",
                  "mode": "cors",
                  "credentials": "include"
                });
                }
                let messageList = []
                let logs = s.data.map(i => {
                    messageList.push(i.dst_info.detail)
                    if (i.dst_info.id_type >= 999) {
                        return i.dst_info.detail
                    }
                })
                this.msg.push(`账号${this.index}的系统消息:${logs.join('|')}\n`)
                log(`账号${this.index}的系统消息:`, messageList.toString())
            } catch(e){console.log(e)}
    }

    async setUserInfo (fix = '') {
            // faker.locale= locale[Math.floor(Math.random() * (locale.length - 1))]
         let userI = {
            // user_name: faker.name.findName(),
            user_name: randomName[Math.floor(Math.random() * (randomName.length-1))],
            avatar_large: userInfo[Math.floor(Math.random() * (userInfo.length - 1))].avatar_large,
            description: userInfo[Math.floor(Math.random() * (userInfo.length - 1))].description,
            company: userInfo[Math.floor(Math.random() * (userInfo.length - 1))].company,
            job_title: userInfo[Math.floor(Math.random() * (userInfo.length - 1))].job_title
        }

        let data = await fetch("https://juejin.cn/web/user/update/user_info/", {"credentials":"include","headers":{"accept":"*/*","accept-language":"zh-CN,zh;q=0.9","content-type":"multipart/form-data; boundary=----WebKitFormBoundaryBhaFPlKfC2mg0gAB", "cookie": this.cookie},"referrer":"https://juejin.cn/user/settings/profile","referrerPolicy":"no-referrer-when-downgrade",
            "body":`------WebKitFormBoundaryBhaFPlKfC2mg0gAB\r\nContent-Disposition: form-data; name=\"aid\"\r\n\r\n2608\r\n------WebKitFormBoundaryBhaFPlKfC2mg0gAB\r\nContent-Disposition: form-data; name=\"avatar\"\r\n\r\n${userI.avatar_large}\r\n------WebKitFormBoundaryBhaFPlKfC2mg0gAB\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\n${userI.user_name}\r\n------WebKitFormBoundaryBhaFPlKfC2mg0gAB\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n${userI.description}\r\n------WebKitFormBoundaryBhaFPlKfC2mg0gAB\r\nContent-Disposition: form-data; name=\"expend_attrs\"\r\n\r\n{\"job_title\":\"${userI.job_title}\",\"company\":\"${userI.company}\",\"blog_address\":\"\"}\r\n------WebKitFormBoundaryBhaFPlKfC2mg0gAB--\r\n`,
            "method":"POST","mode":"cors"});
        data = await data.json()
        if (data.data.error_code == 1028) {
            return await this.setUserInfo()
        }
        log(`账号${this.index}`, data)
    }
    async daytask () {
        try {
            await this.openIndexPage()
            await mathWait()
            await this.randomOpenArticleAndZan()
            // await mathWait()
            // await this.zanFeiDian()
            // await mathWait()
            // await this.signToday()
            // await mathWait()
            // await this.gameSea()
            // await mathWait()
            // await this.bugfix()
            // let nums = await this.get_cur_point()
            // this.msg.push(`账号${this.index}有矿石：${nums}个\n`)
        } catch (e) {
            log(e)
        }
    }
    cookieCheckAndInit() {
        let uuid = this.cookie.match(/web_id%22%3A%22{1}(\d+)/) || this.cookie.match(/web_id%2522%253A%2522{1}(\d+)/) || this.cookie.match(/WEB_ID%2522%253A%2522{1}(\d+)/) || this.cookie.match(/WEB_ID%22%3A%22{1}(\d+)/)
        if(!uuid || !uuid[1]) {
            log(`账号${this.index}cookie不包含web_id信息，请检查`)
            return false
        }
        this.uuid = uuid[1]
        let monitior = this.cookie.match(/MONITOR_WEB_ID=(\S+)/) || this.cookie.match(/monitor_web_id=(\S+)/)
        if(!monitior || !monitior[1]) {
            log(`账号${this.index}cookie不包含monitor_web_id信息，请检查`)
            return false
        }
        this.monitior_web_id = monitior[1]
        this.url_fix = `?aid=${this.aid}&uuid=${this.uuid}`
        this.session_id = this.sessionId()
        this.slardar_session_id = this.slardarSessionId()
        this.cookieOk = true
        return true
    }
    async bugfix () {
        await this.bugfix_index()
        await this.bugfix_competition()   
        const bugs = await this.bugfix_not_collect()
        for (let i =0;i<bugs.length;i++) {
          await mathWait()
          await this.bugfix_collect(bugs[i].bug_type, bugs[i].bug_time)
        }
        let bugNum = await this.bugfix_user()
        log(`账号${this.index}有${bugNum}个bug`)
        if (this.index >= 1 && mainId && this.bugfix_joinRace && bugNum >= 1 && bugfixnow < bugfixmax) {
            await mathWait()
            if (bugfixmax - bugfixnow < bugNum) {
                bugNum = bugfixmax - bugfixnow
            }
            this.bugfix_fix(bugNum)
        } else {
            this.msg.push(`账号${this.index}有${bugNum}个bug\n`)
        }
    }
    async bugfix_fix (bug_fix_num) {
      let res = await fetch(`https://api.juejin.cn/user_api/v1/bugfix/fix${this.url_fix}`, {
                        "headers": {
                          "accept": "*/*",
                          "accept-encoding": "br, gzip, deflate",
                          "accept-language": "zh-cn",
                          "content-type": "application/json",
                          "host": "api.juejin.cn",
                          "user-agent": "xitu 6.1.5 rv:6.1.5.2 (iPhone; iOS 12.0; zh_CN) Cronet",
                          "cookie": this.cookie
                        },

                        // "body": JSON.stringify({
                        //     "competition_id": "7101234141575774219",
                        //     "bug_fix_num": 1,
                        //     "not_self": 0
                        // }),

                        "body": JSON.stringify({
                          "bug_fix_num": bug_fix_num,
                          "assist_user_id": "114763995818984",
                          "competition_id": this.competition_id,
                          "not_self": 1
                        }),

                        
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                        })
      const data = await res.json()
      bugfixnow = data.data.bug_fix_num
      log(`${this.index}__bugfix_fix_data`, data.data, data)
      log(`排名:${data.data.user_rank},修复bug:${data.data.bug_fix_num}`)

      this.msg.push(`ID:${mainId},排名:${data.data.user_rank},修复bug:${data.data.bug_fix_num}\n`)
    }
    async bugfix_collect (bug_type, bug_time) {
      let res = await fetch(`https://api.juejin.cn/user_api/v1/bugfix/collect${this.url_fix}`, {
                    "headers": {
                      "accept": "*/*",
                      "accept-encoding": "br, gzip, deflate",
                      "accept-language": "zh-cn",
                      "content-type": "application/json",
                      "host": "api.juejin.cn",
                      "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366/JueJinAPP",
                      "cookie": this.cookie
                    },
                    "body": JSON.stringify({
                      "bug_type": bug_type,
                      "bug_time": bug_time
                    }),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                    })
                    const data = await res.json()
    }
    async bugfix_not_collect () {
      let res = null
    if (new Date().getHours() >= 12) {
        res = await fetch(`https://api.juejin.cn/user_api/v1/bugfix/not_collect${this.url_fix}&iid=&version_name=6.1.6&app_name=%E7%A8%80%E5%9C%9F%E6%8E%98%E9%87%91&channel=App%20Store&device_platform=iphone&device_type=iPhone%207%20Plus&language=zh-Hans-CN&version_code=6.1.6&device_id=&install_id=&aid=2606&os_version=12.0`, {
                    "headers": {
                      "accept": "*/*",
                      "accept-encoding": "br, gzip, deflate",
                      "accept-language": "zh-cn",
                      "content-type": "application/json",
                      "host": "api.juejin.cn",
                      "user-agent": "xitu 6.1.6 rv:6.1.6.1 (iPhone; iOS 12.0; zh_CN) Cronet",
                      "cookie": this.cookie
                    },
                    "body": JSON.stringify({}),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                    })
    } else {
        res = await fetch(`https://api.juejin.cn/user_api/v1/bugfix/not_collect${this.url_fix}`, {
                    "headers": {
                      "accept": "*/*",
                      "accept-encoding": "br, gzip, deflate",
                      "accept-language": "zh-cn",
                      "content-type": "application/json",
                      "host": "api.juejin.cn",
                      "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366/JueJinAPP",
                      "cookie": this.cookie
                    },
                    "body": JSON.stringify({}),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                    })
    }
  let data = await res.json()
  // console.log('bugfix_not_collect', data)
  this.msg.push(`账号${this.index}本次收集到${data.data.length}个bug\n`)
  await $.wait(1000)
  return data.data || []
    }
    async bugfix_user () {
      try {
          let res = await fetch(`https://api.juejin.cn/user_api/v1/bugfix/user${this.url_fix}`, {
                        "headers": {
                          "accept": "*/*",
                          "accept-encoding": "br, gzip, deflate",
                          "accept-language": "zh-cn",
                          "content-type": "application/json",
                          "host": "api.juejin.cn",
                          "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366/JueJinAPP",
                          "cookie": this.cookie
                        },
                        "body": JSON.stringify({
                          competition_id: `${this.competition_id}`
                        }),
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                        })
      let data = await res.json()
      if (this.index === 0 && data.data.bug_fix_num >= 1) {
        mainId = data.data.user_info.user_id
      }
      return data.data.user_own_bug
      }catch(e) {
          return 0
      }
    }
    async bugfix_competition () {
      let res = await fetch(`https://api.juejin.cn/user_api/v1/bugfix/competition${this.url_fix}`, {
                        "headers": {
                          "accept": "*/*",
                          "accept-encoding": "br, gzip, deflate",
                          "accept-language": "zh-cn",
                          "content-type": "application/json",
                          "host": "api.juejin.cn",
                          "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366/JueJinAPP",
                          "cookie": this.cookie
                        },
                        "body": JSON.stringify({}),
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                        })
      let data = await res.json()
      log(`${this.index}__bugfix活动场次信息`, data.data.from_end_num > 0 ? `${data.data.competition_name}正在进行中，最大可参与bug数：${data.data.from_end_num}`:`${data.data.competition_name}已结束`)
      this.competition_name = data.data.competition_name
      this.can_join_current_bug_fix = data.data.from_end_num > 10
      this.competition_id = data.data.competition_id
      this.bugfix_joinRace = data.data.from_end_num > 0
    }
    async  bugfix_index  () {
      await fetch("https://juejin.cn/user/center/bugfix?enter_from=bugFix_bar", {
              "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "max-age=0",
                "if-none-match": "\"2acfd-dE+ThVbOSshmIMYQRrvdr50+fM0\"",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": this.cookie
              },
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": null,
              "method": "GET",
              "mode": "cors",
              "credentials": "include"
            });
      await mathWait()
      await fetch(`https://juejin.cn/mobile/bugfix?is_hide_title=1&hidebar=0&state_bar_color=0f0a1c&enter_from=user_center`, {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "accept-encoding": "br, gzip, deflate",
          "accept-language": "zh-cn",
          "cookie": this.cookie,
          "host": "juejin.cn",
          "if-none-match": "10fc4-ZYGyA5Q46F5XHdYancK2LuSPHHg",
          "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366/JueJinAPP",
        },
        "method": "GET"
      })
    }
    async gameSea() {
        await this.getUid()
        await this.getSeaToken()
        await this.gameSeaLogin()
        let gameInfo = await this.getSeaInfo()
        this.sea_fresh = false
        if (!this.gameCanRun) {
            let text = `账号${this.index}今日海底掘金游戏已完成，获得矿石${gameInfo.userInfo.todayDiamond}\n`
            log(text)
            this.msg.push(text)
        }
        while(this.gameCanRun) {
            await mathWait()
            if (this.sea_fresh) {
                await this.seaFreshMap()
                await mathWait()
            }
            let next = await this.seaStartGame()
            if (next) {
                await mathWait()
                await this.seaRunCommand()
            }
            await mathWait()
            await this.seaOverGame()
        }

    }

    async seaRunCommand (command = [{"times":10,"command":["D","L"]},{"times":10,"command":["D","R"]},"2",{"times":10,"command":["D","L"]},"2","R","R","U","L","2"]) {
        let res = await fetch(`https://juejin-game.bytedance.com/game/sea-gold/game/command?uid=${this.sea_uid}&time=${new Date().getTime()}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": this.sea_token,
                "content-type": "application/json;charset=UTF-8",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "x-tt-gameid": this.gen_x_tt_gameId()
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({command: command}),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
            })
        let data = await res.json()
        try {
            if(data.code === 4009) {
                this.sea_fresh = true
            } else if (data.data.gameDiamond <= 200) {
                this.sea_fresh = true
            }
        } catch (e) {
            log(`${this.index}__gamerun`, data)
            log(e)
            this.sea_fresh = true
        }
        return Promise.resolve()
    }
    gen_x_tt_gameId () {
        return jwt.sign({
            gameId: this.sea_game_id,
            time: (new Date).getTime() + ""
        }, "-----BEGIN EC PARAMETERS-----\nBggqhkjOPQMBBw==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIDB7KMVQd+eeKt7AwDMMUaT7DE3Sl0Mto3LEojnEkRiAoAoGCCqGSM49\nAwEHoUQDQgAEEkViJDU8lYJUenS6IxPlvFJtUCDNF0c/F/cX07KCweC4Q/nOKsoU\nnYJsb4O8lMqNXaI1j16OmXk9CkcQQXbzfg==\n-----END EC PRIVATE KEY-----\n", {
            algorithm: "ES256",
            expiresIn: 2592e3,
            header: {
                alg: "ES256",
                typ: "JWT"
            }
        });
    }
    async seaStartGame () {
        let res = await fetch(`https://juejin-game.bytedance.com/game/sea-gold/game/start?uid=${this.sea_uid}&time=${new Date().getTime()}`, {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "authorization": this.sea_token,
            "content-type": "application/json;charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "x-tt-gameid": ""
          },
          "referrer": "https://juejin.cn/game/haidijuejin/?utm_campaign=hdjjgame&utm_medium=user_center",
          "referrerPolicy": "no-referrer-when-downgrade",
          "body": JSON.stringify({roleId:2}),
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        })
        let data = await res.json()
        if (data.code === 4007) {
            this.sea_fresh = true
            return false
        } else if (data.code ===0) {
            this.sea_game_id = data.data.gameId
            return true
        } else {
            this.sea_fresh = true
            return false
        }
    }
    async seaFreshMap () {
        await fetch(`https://juejin-game.bytedance.com/game/sea-gold/game/fresh_map?uid=${this.sea_uid}&time=${new Date().getTime()}`, {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": this.sea_token,
                "content-type": "application/json;charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
              },
              "referrer": "https://juejin.cn/game/haidijuejin/?utm_campaign=hdjjgame&utm_medium=user_center",
              "referrerPolicy": "no-referrer-when-downgrade",
              "body": "{}",
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
        log(`账号${this.index}刷新地图完成`)
        this.sea_fresh = false
    }

    async gameSeaAuth () {
        let res = await fetch(`https://juejin-game.bytedance.com/game/sea-gold/user/auth?uid=${this.sea_uid}&time=${new Date().getTime()}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": this.sea_token,
                "content-type": "application/json;charset=UTF-8",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
            });
        let data = await res.json()
        log(`账号${this.index}授权完成`)
    }
    async gameSeaLogin () {
        let res = await fetch(`https://juejin-game.bytedance.com/game/sea-gold/user/login?uid=${this.sea_uid}&time=${new Date().getTime()}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": this.sea_token,
                "content-type": "application/json;charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://juejin.cn/game/haidijuejin/?utm_campaign=hdjjgame&utm_medium=user_center",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": JSON.stringify({name: this.sea_name}),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
            });
        let data = await res.json()
        if (!data.data.isAuth) {
            log(`账号${this.index}游戏需要授权`)
            await this.gameSeaAuth()
        }
    }

    async seaOverGame () {
        let res = await fetch(`https://juejin-game.bytedance.com/game/sea-gold/game/over?uid=${this.sea_uid}&time=${new Date().getTime()}`, {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": this.sea_token,
                "content-type": "application/json;charset=UTF-8",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": "{\"isButton\":1}",
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            })
                let data = await res.json()
                log(`账号${this.index},本次运行获得钻石${data.data.gameDiamond}`)
                if (this.sea_fresh) {
                    return
                }
                if (data.data.todayDiamond < data.data.todayLimitDiamond) { 
                    log(`账号${this.index}继续游戏,今天已获得${data.data.todayDiamond}`)
                } else {
                    log(`账号${this.index}游戏今日任务完成，获取到钻石${data.data.todayDiamond}\n`)
                    this.msg.push(`账号${this.index}海底掘金游戏今日完成，获取到钻石${data.data.todayDiamond}\n`)
                    this.gameCanRun = false
                }
    }

    async getUid (referrer = "https://juejin.cn/game/haidijuejin/?utm_campaign=hdjjgame&utm_medium=user_center") {
        let res = await fetch("https://api.juejin.cn/user_api/v1/user/get", {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cookie": this.cookie
          },
          referrer,
          "referrerPolicy": "no-referrer-when-downgrade",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "include"
        });
        let data = await res.json()
        this.sea_uid = data.data.user_id
        this.sea_name = data.data.user_name
    }
    async getSeaToken () {
        let  res = await fetch("https://juejin.cn/get/token", {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "if-none-match": "W/\"211-OtXV4ZfFqrL7zPEl7DTn+tCHt7I\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "cookie": this.cookie
                    },
                    "referrer": "https://juejin.cn/game/haidijuejin/?utm_campaign=hdjjgame&utm_medium=user_center",
                    "referrerPolicy": "no-referrer-when-downgrade",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                    });
        let token = await res.json()
        this.sea_token = `Bearer ${token.data}`
    }

    async getSeaInfo () {
        const data = await fetch(`https://juejin-game.bytedance.com/game/sea-gold/home/info?uid=${this.sea_uid}&time=${new Date().getTime()}`, {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": this.sea_token,
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": null,
              "method": "GET",
              "mode": "cors",
              "credentials": "include"
            });
        const d = await data.json()
        try {
            if (!d.data.userInfo.todayDiamond) {
                this.gameCanRun = true
            } else {
                this.gameCanRun = d.data.userInfo.todayDiamond < d.data.userInfo.todayLimitDiamond
            }
        } catch(e) {
            this.gameCanRun = true
        }
        return d.data
    }

    async signToday () {
        await this.getTodaySignStatus()
        if (!this.sign) {
            log(`账号${this.index}执行签到`)
            await this.openSignIndexPage()
            await mathWait()
            await this.juejingSign()
            await mathWait()
            await this.juejinDiopList()
            await mathWait()
            await this.juejinLottery()
        } else {
            log(`账号${this.index}今日已签到`)
        }
    }
    async md5webToken () {
        try {
            // md5token(this, $)
        } catch (e) {}
    }
    sessionId() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
            let t = 16 * Math.random() | 0;
            return ("x" === e ? t : 3 & t | 8).toString(16)
        }
        ))
    }
    slardarSessionId() {
        var t = function() {
            for (var t = new Array(16), e = 0, n = 0; n < 16; n++)
                0 == (3 & n) && (e = 4294967296 * Math.random()),
                t[n] = e >>> ((3 & n) << 3) & 255;
            return t
        }();
        return t[6] = 15 & t[6] | 64,
        t[8] = 63 & t[8] | 128,
        function(t) {
            for (var e = [], n = 0; n < 256; ++n)
                e[n] = (n + 256).toString(16).substr(1);
            var r = 0
              , o = e;
            return [o[t[r++]], o[t[r++]], o[t[r++]], o[t[r++]], "-", o[t[r++]], o[t[r++]], "-", o[t[r++]], o[t[r++]], "-", o[t[r++]], o[t[r++]], "-", o[t[r++]], o[t[r++]], o[t[r++]], o[t[r++]], o[t[+r]], o[t[15]]].join("")
        }(t)
    }
    async luckDraw () {
        let data = await fetch("https://api.juejin.cn/growth_api/v1/lottery_lucky/lucky_draw" + this.url_fix, {"credentials":"include","headers":{"accept":"*/*","accept-language":"zh-CN,zh;q=0.9","content-type":"application/json","sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-site", "cookie": this.cookie},"referrer":"https://juejin.cn/user/center/lottery?from=lucky_lottery_menu_bar","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"POST","mode":"cors"});
        data = await data.json()
        log(data)
        notify.sendNotify('掘金抽奖', `账号${this.index}抽到了${data.data.lottery_name}`)
    }
    async juejinLottery (oneTimes = true) {
        let data = await fetch(`https://api.juejin.cn/growth_api/v1/lottery/${oneTimes ? 'draw' : 'ten_draw'}${this.url_fix}`, {
          "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cookie": this.cookie
          },
          "referrer": "https://juejin.cn/user/center/lottery?from=lucky_lottery_menu_bar",
          "referrerPolicy": "no-referrer-when-downgrade",
          "body": "{}",
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
        data = await data.json()
        data = data.data
        const reg = /\d+矿石|Bug/
        if (oneTimes) {
            log(`账号${this.index}抽到了${data.lottery_name}__当前幸运值：${data.total_lucky_value}\n`)
            this.msg.push(`账号${this.index}抽到了${data.lottery_name}__当前幸运值：${data.total_lucky_value}\n`)
            if (data.total_lucky_value >= 6000) {
                await this.luckDraw()
            }
            if (!reg.test(data.lottery_name)) {
                notify.sendNotify('掘金抽奖', `账号${this.index}抽到了${data.lottery_name}`)
            }
        } else {
            const lotterName = data.LotteryBases.map(i => {
                if (!reg.test(i.lottery_name)) {
                    notify.sendNotify('掘金抽奖', `账号${this.index}抽到了${i.lottery_name}`)
                }
                return `${i.lottery_name}`
            })    
            log(`账号${this.index}抽到了以下奖品:${lotterName.toString()}\n`)
            this.msg.push(`账号${this.index}抽到了以下奖品:${lotterName.toString()}\n`)
        }
    }
    async juejingSign () {
        try {
            let data = await fetch(`https://api.juejin.cn/growth_api/v1/check_in${this.url_fix}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": this.cookie,
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
        data = await data.json()
        if (data.err_no === 15001) {
            this.sign = true
            this.msg.push(`${data.err_msg || '账号' + this.index +'今日已签到'}`)
        } else if (data.err_no === 403) {
            this.login = false
            this.msg.push(`账号${this.index}的cookie已失效`)
        }
    } catch(e) {
        log('jueingsing', e)
    }
    }
    async juejinDiopList () {
        let data, id;
        try {
            data = await fetch(`https://api.juejin.cn/growth_api/v1/lottery_history/global_big${this.url_fix}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "application/json",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "cookie": this.cookie,
                },
                "referrer": "https://juejin.cn/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": JSON.stringify({page_no: 1,page_size: 5}),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            })
            data = await data.json()
            id = data.data.lotteries[0].history_id
            if (id && !global.lottery_history_id) {
                global.lottery_history_id = id
            }
        } catch (e) {
            console.log('growth_api/v1/lottery_history/global_big', e)
        }
        data = await fetch(`https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky${this.url_fix}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": this.cookie,
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({lottery_history_id:id || global.lottery_history_id}),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
        data = await data.json()
        log(`${this.index}__粘福气,粘到${data.data.dip_value}, 当前总福气${data.data.total_value}`,)
        this.msg.push(`${this.index}__粘福气,粘到${data.data.dip_value}, 当前总福气${data.data.total_value}\n`)
    }
    async getTodaySignStatus (check = false) {
        try {
            const data = await fetch(`https://api.juejin.cn/growth_api/v1/get_today_status${this.url_fix}`, {
              "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": this.cookie,
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": null,
              "method": "GET",
              "mode": "cors",
              "credentials": "include"
            });

            const status = await data.json()
            log(`${this.index}__getTodaySign`, status.data)
            if (status.err_msg != 'success') {
                this.ok = false
                this.msg.push(`账号${this.index}的cookie已失效\n`)
                return
            }
            this.ok = true
            if (status.data === true) {
                this.sign = true
                !check && this.msg.push(`账号${this.index}今日已签到\n`)
            }
        } catch(e) {throw new Error(e)}
    }
    async get_cur_point () {
        const res = await fetch(`https://api.juejin.cn/growth_api/v1/get_cur_point${this.url_fix}`, {
              "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                cookie: this.cookie
              },
              "referrer": "https://juejin.cn/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": null,
              "method": "GET",
              "mode": "cors",
              "credentials": "include"
            });
        let data = await res.json()
        log(`${this.index}__get_cur_point`, data)
        return data.data
    }
    async openIndexPage () {
        try {
            await fetch("https://juejin.cn/", {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "cookie": this.cookie,
                },
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
                });
            await this.profileId()
            await this.abtest()
            await this.urlRequest(`https://api.juejin.cn/growth_api/v1/get_today_status`)
            await this.snssdkList()
            await this.sdkSetting()
            await this.urlRequest('https://api.juejin.cn/growth_api/v1/get_counts')
            await this.urlRequest('https://api.juejin.cn/interact_api/v1/pin_tab_lead')
            await this.urlRequest('https://api.juejin.cn/list_api/v1/activity_settings')
            await this.urlRequest('https://api.juejin.cn/interact_api/v1/message/count')
            await this.urlRequest(`https://api.juejin.cn/user_api/v1/author/recommend?${this.url_fix}&category_id=&cursor=0&limit=20`, 'GET', null, false)
            await this.urlRequest('https://api.juejin.cn/content_api/v1/advert/query_adverts', 'POST', {
                "position": 100,
                "platform": 2608,
                "layout": 1
                })
            await this.urlRequest('https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed', 'POST', {
                "id_type": 2,
                "client_type": 2608,
                "sort_type": 200,
                "cursor": "0",
                "limit": 20
                })
            await this.urlRequest('https://api.juejin.cn/list_api/v1/activity_settings_v1', 'POST', {
                "activity_name_list": [
                    "top",
                    "offer"
                ]
                })
            await this.urlRequest('https://api.juejin.cn/tag_api/v1/query_category_briefs')
            await this.snssdkList2()
            await this.urlRequest('https://api.juejin.cn/recommend_api/v1/dislike/white_list', 'POST', {})
            await this.snssdkList3()
            await this.batch()
        } catch (e) {
            log(e)
        }
    }
    async openSignIndexPage () {
        await fetch("https://juejin.cn/user/center/signin?from=avatar_menu", {
            "headers": {
              "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
              "accept-language": "zh-CN,zh;q=0.9",
              "cache-control": "no-cache",
              "pragma": "no-cache",
              "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "document",
              "sec-fetch-mode": "navigate",
              "sec-fetch-site": "same-origin",
              "sec-fetch-user": "?1",
              "upgrade-insecure-requests": "1",
              "cookie": this.cookie,
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
          });
      await this.profileId()
      await this.abtest('sign')
      await this.getRules()
      await this.urlRequest(`https://api.juejin.cn/growth_api/v1/get_counts`)
      await this.urlRequest(`https://api.juejin.cn/growth_api/v1/get_coder_calendar`)
      await this.urlRequest(`https://api.juejin.cn/growth_api/v1/get_today_status`)
      await this.urlRequest(`https://api.juejin.cn/growth_api/v1/get_cur_point`)
      await this.urlRequest(`https://api.juejin.cn/interact_api/v1/pin_tab_lead`)
      await this.urlRequest(`https://api.juejin.cn/list_api/v1/annual/user_annual_list`,  'POST', {
                    "user_id": this.profile_id,
                    "annual_ids": [
                        "2021",
                        "2020"
                    ]
                    })
      await this.urlRequest(`https://api.juejin.cn/interact_api/v1/message/count`)
      await this.urlRequest(`https://api.juejin.cn/list_api/v1/activity_settings`)
      try {
         this.md5webToken()
      } catch(e){}
      await this.urlRequest(`https://api.juejin.cn/list_api/v1/activity_settings_v1`, 'POST', {
              "activity_name_list": [
                "top",
                "offer"
              ]
            })
        await this.urlRequest(`https://api.juejin.cn/growth_api/v1/get_by_month`)
        await this.urlRequest(`https://api.juejin.cn/growth_api/v1/get_cur_supp`)
        await this.urlRequest(`https://api.juejin.cn/tag_api/v1/query_category_briefs`)
    }
    async getRules () {
        await fetch(`https://api.juejin.cn/growth_api/v1/get_rules_text${this.url_fix}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "cookie": this.cookie
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
            });
    }
    async randomOpenArticleAndZan () {
        const article = await this.recommend_all_feed()
        let item_type = 0
        let postId = 0
        let sss = [
    "7110033715559923720",
    "7109642671970336776",
    "7109300115680002085",
    "7108900890701987847",
    "7108528885733523487",
    "7108148294995410958",
    "7107787730263736327",
    "7107414966335963166",
    "7107047772364374030",
    "7106759732026671118",
    "7106381938759303182",
    "7106314751277268999",
    "7106036832231489567",
    "7105577362653184013",
    "7104446814098554916",
    "7104170359091363853",
    "7103782170598047758",
    "7103406153610035207",
    "7103047160161107999",
    "7102599560874164255",
    "7102338292867137544",
    "7102298447365177358",
    "7100166078277517326",
    "7089698682907394079",
    "7087116208847192100",
    "6844903652184850440"
]
        // while (+item_type !== 2 && !postId) {
        //     let item = article[Math.floor(Math.random() * article.length)]
        //     postId = item.item_info.article_id
        //     item_type = item.item_type
        // }
        // sss.map(async (i) => {
        //     console.log(i)
            
        // })
        for(let i=0; i<sss.length-1;i++) {
            console.log(sss[i], 'shua')
            await this.openArticle(sss[i])    
            await mathWait()
        }
        // for(let v of sss) {
            
        // }
        await mathWait()
        
    }
    async recommend_all_feed () {
        try {
            const res = await fetch(`https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed${this.url_fix}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "application/json",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://juejin.cn/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "{\"id_type\":2,\"client_type\":2608,\"sort_type\":200,\"cursor\":\"0\",\"limit\":20}",
                "method": "POST",
                "mode": "cors",
                "credentials": "include",
                "cookie": this.cookie,
                });
            const data = await res.json()
            return data.data
        } catch(e) {
            log(`${this.index}__recommend_all_feed`, e)
        }
    }
    async openArticle (id) {
        const data = await fetch(`https://juejin.cn/post/${id}`, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "max-age=0",
                "if-none-match": "\"2644c-umG2xBrUDTBIO5VrbgdLPyrYZ/0\"",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": this.cookie,
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
            });
        const content = await data.text()
        // console.log(content, 'content')
        let user_idArr = content.match(/href="\/user\/\d{0,30}"/g)
        let user_id = user_idArr[1]
        if (!user_id) return
        let userId = user_id.match(/\d+/)
        await fetch(`https://api.juejin.cn/recommend_api/v1/article/recommend_article_detail_feed${this.url_fix}`, {
          "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cookie": this.cookie,
          },
          "referrer": "https://juejin.cn/",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": JSON.stringify({
              "id_type": 2,
              "user_id": userId[0],
              "item_id": id,
              "cursor": "0"
            }),
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
        await fetch(`https://api.juejin.cn/recommend_api/v1/article/recommend_tag_feed${this.url_fix}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "cookie": this.cookie,
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({
            "id_type": 2,
            "cursor": "0",
            "item_id": id,
            "sort_type": 200
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
            });
        await mathWait()
        // await this.zanArticle(id)
    }
    async zanArticle (id) {
        let res = await fetch(`https://api.juejin.cn/interact_api/v1/digg/save${this.url_fix}`, {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "content-type": "application/json",
                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "cookie": this.cookie,
                    },
                    "referrer": "https://juejin.cn/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": JSON.stringify({
                "item_id": id + '',
                "item_type": 2,
                "client_type": 2608
                }),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                    });
        res = await res.json()
        console.log(res)
    }
    async profileId () {
        let data = await fetch(`https://api.juejin.cn/user_api/v1/user/profile_id?aid=2608&uuid=${this.uuid}&web_id=${this.uuid}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "application/json",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "cookie": this.cookie
                },
                "referrer": "https://juejin.cn/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
                });
        data = await data.json()
        !this.profile_id && console.log(`账号${this.index}的userId:${data.data.profile_id}`)
        this.profile_id = data.data.profile_id
    }
    async abtest (type = 'index') {
        let data
        if (type === 'sign') {
            data = await fetch("https://abtestvm.bytedance.com/service/2/abtest_config/", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/json; charset=UTF-8",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                "referrer": "https://juejin.cn/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": JSON.stringify({
                    "header": {
                        "aid": aid,
                        "user_unique_id": this.uuid,
                        "user_id": this.profile_id,
                        "user_is_login": true,
                        "web_id": this.uuid,
                        "app_id": aid,
                        "os_name": "windows",
                        "os_version": "7",
                        "device_model": "Windows NT 6.1",
                        "language": "zh-CN",
                        "platform": "Web",
                        "sdk_version": "4.2.9",
                        "sdk_lib": "js",
                        "timezone": 8,
                        "tz_offset": -28800,
                        "resolution": "1536x864",
                        "browser": "Chrome",
                        "browser_version": "98.0.4758." + (100 + this.index),
                        "referrer": "",
                        "referrer_host": "",
                        "width": 1536,
                        "height": 864,
                        "screen_width": 1536,
                        "screen_height": 864,
                        "utm_source": "gold_browser_extension",
                        "tracer_data": "{\"$utm_from_url\":1}",
                        "custom": {
                            "student_verify_status": "not_student",
                            "user_level": this.level
                        },
                        "ab_sdk_version": "90001195",
                        "ab_url": "https://juejin.cn/user/center/signin?from=avatar_menu"
                    }
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
                });
        } else if (type === 'index') {
            data = await fetch("https://abtestvm.bytedance.com/service/2/abtest_config/", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "application/json; charset=UTF-8",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                "referrer": "https://juejin.cn",
                "referrerPolicy": "strict-origin-when-cross-origin",

                "body": JSON.stringify({header: {
                "aid": aid,
                "user_unique_id": this.uuid,
                "user_id": this.profile_id,
                "user_is_login": true,
                "web_id": this.uuid,
                "app_id": aid,
                "os_name": "windows",
                "os_version": "10",
                "device_model": "Windows NT 10.0",
                "language": "zh-CN",
                "platform": "Web",
                "sdk_version": "4.2.9",
                "sdk_lib": "js",
                "timezone": 8,
                "tz_offset": -28800,
                "resolution": "1920x1080",
                "browser": "Chrome",
                "browser_version": "98.0.4758." + (100 + this.index),
                "referrer": "",
                "referrer_host": "",
                "width": 1920,
                "height": 1080,
                "screen_width": 1920,
                "screen_height": 1080,
                "utm_source": "gold_browser_extension",
                "custom": {
                    "student_verify_status": "not_student",
                    "user_level": this.level
                },
                "ab_sdk_version": "",
                "ab_url": "https://juejin.cn/"
                }}),
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
                });
        }
        data = await data.json()
    }
    async urlRequest(url, method = 'GET', body = null, url_fix = true) {
        try {
            let data  = await fetch(url_fix ? `${url}${this.url_fix}` : url, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "cookie": this.cookie
                },
                "referrer": "https://juejin.cn/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": method === 'POST' ? JSON.stringify(body) : body,
                method,
                "mode": "cors",
                "credentials": "include"
                });
            data = await data.json()
        } catch(e) {
            log(e)
        }
    }
    async snssdkList () {
        await fetch("https://mcs.snssdk.com/list", {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "cache-control": "no-cache",
                        "content-type": "application/json; charset=UTF-8",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "cross-site"
                    },
                    "referrer": "https://juejin.cn/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": JSON.stringify([
                            {
                                "events": [
                                    {
                                        "event": "applog_trace",
                                        "params": `{\"count\":3,\"state\":\"net\",\"key\":\"log\",\"params_for_special\":\"applog_trace\",\"aid\":2608,\"platform\":\"web\",\"_staging_flag\":1,\"sdk_version\":\"4.2.9\",\"event_index\":${new Date().getTime()}}`,
                                        "local_time_ms": new Date().getTime()
                                    }
                                ],
                                "user": {
                                    "user_unique_id": this.uuid,
                                    "user_id": this.profile_id,
                                    "user_is_login": true,
                                    "web_id": this.uuid
                                },
                                "header": {
                                    "app_id": aid,
                                    "os_name": "windows",
                                    "os_version": "10",
                                    "device_model": "Windows NT 10.0",
                                    "language": "zh-CN",
                                    "platform": "Web",
                                    "sdk_version": "4.2.9",
                                    "sdk_lib": "js",
                                    "timezone": 8,
                                    "tz_offset": -28800,
                                    "resolution": "1920x1080",
                                    "browser": "Chrome",
                                    "browser_version": "98.0.4758.102",
                                    "referrer": `https://juejin.cn/user/${this.profile_id}?utm_source=gold_browser_extension`,
                                    "referrer_host": "juejin.cn",
                                    "width": 1920,
                                    "height": 1080,
                                    "screen_width": 1920,
                                    "screen_height": 1080,
                                    "utm_source": "gold_browser_extension",
                                    "tracer_data": "{\"$utm_from_url\":1}",
                                    "custom": `{\"student_verify_status\":\"not_student\",\"user_level\":${this.level}}`
                                },
                                "local_time": new Date().getTime().toString().substring(0,10) * 1
                            }
                        ]),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "omit"
                    });
    }
    async snssdkList2 () {
        let data = await fetch("https://mcs.snssdk.com/list", {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json; charset=UTF-8",
            "pragma": "no-cache",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Opera\";v=\"84\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        "referrer": "https://juejin.cn/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify([
        {
            "events": [
            {
                "event": "article_timeline_load",
                "params": `{\"_staging_flag\":0,\"article_timeline_type\":\"recommended\",\"event_index\":${new Date().getTime()}}`,
                "local_time_ms": new Date().getTime(),
                "is_bav": 0,
                "ab_sdk_version": "",
                "session_id": this.session_id
            },
            {
                "event": "main_page_sign_in_visit",
                "params": `{\"_staging_flag\":0,\"event_index\":${new Date().getTime()}}`,
                "local_time_ms": new Date().getTime(),
                "is_bav": 0,
                "ab_sdk_version": "",
                "session_id": this.session_id
            },
            {
                "event": "predefine_pageview",
                "params": `{\"_staging_flag\":0,\"title\":\"掘金 - 代码不止，掘金不停\",\"url\":\"https://juejin.cn/\",\"url_path\":\"/\",\"time\":${new Date().getTime()},\"referrer\":\"\",\"$is_first_time\":\"false\",\"event_index\":${new Date().getTime()}}`,
                "local_time_ms": new Date().getTime(),
                "is_bav": 0,
                "ab_sdk_version": "",
                "session_id": this.session_id
            }
            ],
            "user": {
            "user_unique_id": this.uuid,
            "user_id": this.profile_id,
            "user_is_login": true,
            "web_id": this.uuid
            },
            "header": {
            "app_id": 2608,
            "os_name": "windows",
            "os_version": "10",
            "device_model": "Windows NT 10.0",
            "language": "zh-CN",
            "creative_id": null,
            "ad_id": null,
            "campaign_id": null,
            "platform": "Web",
            "sdk_version": "4.2.9",
            "sdk_lib": "js",
            "timezone": 8,
            "tz_offset": -28800,
            "resolution": "1920x1080",
            "browser": "Chrome",
            "browser_version": `98.0.4758.${100 + (+this.index)}`,
            "referrer": "",
            "referrer_host": "",
            "width": 1920,
            "height": 1080,
            "screen_width": 1920,
            "screen_height": 1080,
            "custom": `{\"student_verify_status\":\"not_student\",\"user_level\":${this.level}}`
            },
            "local_time": new Date().getTime().toString().substring(0,10) * 1
        }
        ]),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
        });
    }
    async snssdkList3() {
        let data = await fetch("https://mcs.snssdk.com/list", {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json; charset=UTF-8",
            "pragma": "no-cache",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Opera\";v=\"84\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "x-mcs-appkey": xMcsppkey
        },
        "referrer": "https://juejin.cn/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify([
        {
            "events": [
            {
                "event": "onload",
                "params": "{\"app_id\":2608,\"app_name\":\"\",\"sdk_version\":\"4.2.9\",\"sdk_type\":\"npm\",\"sdk_config\":{\"app_id\":2608,\"channel\":\"cn\",\"log\":false,\"enable_ab_test\":true,\"ab_channel_domain\":\"https://abtestvm.bytedance.com\",\"cross_subdomain\":true,\"cookie_expire\":94608000000,\"cookie_domain\":\"juejin.cn\",\"enable_stay_duration\":true,\"maxDuration\":1200000}}",
                "local_time_ms": new Date().getTime()
            }
            ],
            "user": {
            "user_unique_id": this.uuid
            },
            "header": {}
        }
        ]),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
        });
        data = await fetch("https://mcs.snssdk.com/list", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json; charset=UTF-8",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Opera\";v=\"84\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify([
            {
                "events": [
                {
                    "event": "article_timeline_load",
                    "params": `{\"_staging_flag\":0,\"article_timeline_type\":\"recommended\",\"event_index\":${new Date().getTime()}}`,
                    "local_time_ms": new Date().getTime(),
                    "is_bav": 0,
                    "ab_sdk_version": "",
                    "session_id": this.session_id
                },
                {
                    "event": "main_page_sign_in_visit",
                    "params": `{\"_staging_flag\":0,\"event_index\":${new Date().getTime()}}`,
                    "local_time_ms": new Date().getTime(),
                    "is_bav": 0,
                    "ab_sdk_version": "",
                    "session_id": this.session_id
                },
                {
                    "event": "predefine_pageview",
                    "params": `{\"_staging_flag\":0,\"title\":\"掘金 - 代码不止，掘金不停\",\"url\":\"https://juejin.cn/\",\"url_path\":\"/\",\"time\":${new Date().getTime()},\"referrer\":\"\",\"$is_first_time\":\"false\",\"event_index\":${new Date().getTime()}}`,
                    "local_time_ms": new Date().getTime(),
                    "is_bav": 0,
                    "ab_sdk_version": "",
                    "session_id": this.session_id
                }
                ],
                "user": {
                "user_unique_id": this.uuid,
                "user_id": this.profile_id,
                "user_is_login": true,
                "web_id": this.uuid
                },
                "header": {
                "app_id": 2608,
                "os_name": "windows",
                "os_version": "10",
                "device_model": "Windows NT 10.0",
                "language": "zh-CN",
                "creative_id": null,
                "ad_id": null,
                "campaign_id": null,
                "platform": "Web",
                "sdk_version": "4.2.9",
                "sdk_lib": "js",
                "timezone": 8,
                "tz_offset": -28800,
                "resolution": "1920x1080",
                "browser": "Chrome",
                "browser_version": "98.0.4758." + (100 + this.index),
                "referrer": "",
                "referrer_host": "",
                "width": 1920,
                "height": 1080,
                "screen_width": 1920,
                "screen_height": 1080,
                "custom": `{\"student_verify_status\":\"not_student\",\"user_level\":${this.level}}`
                },
                "local_time": new Date().getTime().toString().substring(0,10) * 1
            }
            ]),
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
            });
        data = await fetch("https://mcs.snssdk.com/list", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json; charset=UTF-8",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Opera\";v=\"84\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify([
            {
                "events": [
                {
                    "event": "ad_web_banner_show",
                    "params": `{\"_staging_flag\":0,\"ad_url\":\"https://juejin.cn/book/7047357110337667076?utm_source=web_banner&utm_medium=banner&utm_campaign=xiaoce\",\"event_index\":${new Date().getTime()}}`,
                    "local_time_ms": new Date().getTime(),
                    "is_bav": 0,
                    "ab_sdk_version": "",
                    "session_id": this.session_id
                },
                {
                    "event": "ad_web_banner_show",
                    "params": `{\"_staging_flag\":0,\"ad_url\":\"https://juejin.cn/post/7069661622012215309/?utm_source=web_feed&utm_medium=banner&utm_campaign=chunzhao\",\"event_index\":${new Date().getTime()}}`,
                    "local_time_ms": new Date().getTime(),
                    "is_bav": 0,
                    "ab_sdk_version": "",
                    "session_id": this.session_id
                }
                ],
                "user": {
                "user_unique_id": this.uuid,
                "user_id": this.profile_id,
                "user_is_login": true,
                "web_id": this.uuid
                },
                "header": {
                "app_id": 2608,
                "os_name": "windows",
                "os_version": "10",
                "device_model": "Windows NT 10.0",
                "language": "zh-CN",
                "creative_id": null,
                "ad_id": null,
                "campaign_id": null,
                "platform": "Web",
                "sdk_version": "4.2.9",
                "sdk_lib": "js",
                "timezone": 8,
                "tz_offset": -28800,
                "resolution": "1920x1080",
                "browser": "Chrome",
                "browser_version": "98.0.4758.102",
                "referrer": "",
                "referrer_host": "",
                "width": 1920,
                "height": 1080,
                "screen_width": 1920,
                "screen_height": 1080,
                "custom": `{\"student_verify_status\":\"not_student\",\"user_level\":${this.level},\"profile_id\":\"${this.profile_id}\"}`
                },
                "local_time": new Date().getTime().toString().substring(0,10) * 1
            }
            ]),
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
            });
    }
    async sdkSetting () {
        await fetch("https://i.snssdk.com/slardar/sdk_setting?bid=juejin_web", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Opera\";v=\"84\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "cookie": this.monitior_web_id
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
            });
    }
    async batch() {
        await fetch("https://i.snssdk.com/log/sentry/v2/api/slardar/batch/", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Opera\";v=\"84\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({
            "ev_type": "batch",
            "list": [
                {
                "ev_type": "ajax",
                "ax_status": "200",
                "ax_type": "get",
                "ax_request_header": "",
                "ax_domain": "i.snssdk.com",
                "ax_duration": 56,
                "ax_path": "/slardar/sdk_setting",
                "ax_protocol": "https",
                "ax_response_header": "content-type: application/json; charset=utf-8",
                "ax_size": 6513,
                "ax_url": "https://i.snssdk.com/slardar/sdk_setting",
                "ax_href": "https://i.snssdk.com/slardar/sdk_setting?bid=juejin_web",
                "ax_search": "?bid=juejin_web",
                "resource_timing": {
                    "name": "https://i.snssdk.com/slardar/sdk_setting?bid=juejin_web",
                    "entryType": "resource",
                    "startTime": 1462.7999999523163,
                    "duration": 50.09999990463257,
                    "initiatorType": "xmlhttprequest",
                    "nextHopProtocol": "h2",
                    "workerStart": 0,
                    "redirectStart": 0,
                    "redirectEnd": 0,
                    "fetchStart": 1462.7999999523163,
                    "domainLookupStart": 1462.7999999523163,
                    "domainLookupEnd": 1462.7999999523163,
                    "connectStart": 1462.7999999523163,
                    "connectEnd": 1462.7999999523163,
                    "secureConnectionStart": 1462.7999999523163,
                    "requestStart": 1463.5999999046326,
                    "responseStart": 1512.0999999046326,
                    "responseEnd": 1512.8999998569489,
                    "transferSize": 1128,
                    "encodedBodySize": 828,
                    "decodedBodySize": 6519,
                    "serverTiming": [
                    {
                        "name": "inner",
                        "duration": 3,
                        "description": ""
                    },
                    {
                        "name": "cdn-cache",
                        "duration": 0,
                        "description": "MISS"
                    },
                    {
                        "name": "edge",
                        "duration": 0,
                        "description": ""
                    },
                    {
                        "name": "origin",
                        "duration": 43,
                        "description": ""
                    }
                    ],
                    "workerTiming": []
                },
                "version": "3.6.42",
                "hostname": "juejin.cn",
                "protocol": "https",
                "url": "https://juejin.cn/",
                "slardar_session_id": this.slardar_session_id,
                "sample_rate": 1,
                "pid": "index",
                "report_domain": "i.snssdk.com",
                "screen_resolution": "1920x1080",
                "network_type": "4g",
                "bid": "juejin_web",
                "context": "{}",
                "slardar_web_id": this.monitior_web_id,
                "report_type": "xhr",
                "performanceAuto": false,
                "reportURLSingle": "https://i.snssdk.com/log/sentry/v2/api/slardar/main/",
                "region": "cn",
                "env": "production",
                "refreshPrecollectedContext": false,
                "maxBatchReportLength": 10,
                "batchReportWait": 1000,
                "client_time": new Date().getTime()
                },
                {
                "ev_type": "pageview",
                "version": "3.6.42",
                "hostname": "juejin.cn",
                "protocol": "https",
                "url": "https://juejin.cn/",
                "slardar_session_id": this.slardar_session_id,
                "sample_rate": 1,
                "pid": "index",
                "report_domain": "i.snssdk.com",
                "screen_resolution": "1920x1080",
                "network_type": "4g",
                "bid": "juejin_web",
                "context": "{}",
                "slardar_web_id": this.monitior_web_id,
                "report_type": "xhr",
                "performanceAuto": false,
                "reportURLSingle": "https://i.snssdk.com/log/sentry/v2/api/slardar/main/",
                "region": "cn",
                "env": "production",
                "refreshPrecollectedContext": false,
                "maxBatchReportLength": 10,
                "batchReportWait": 1000,
                "client_time": new Date().getTime()
                },
                {
                "ev_type": "ajax",
                "ax_status": "200",
                "ax_type": "post",
                "ax_request_header": "Content-Type: application/json; charset=utf-8",
                "ax_domain": "mcs.snssdk.com",
                "ax_duration": 65,
                "ax_path": "/list",
                "ax_protocol": "https",
                "ax_response_header": "cache-control: no-store, no-cache, must-revalidate\r\ncontent-length: 7\r\ncontent-type: application/json; charset=utf-8\r\nexpires: 0\r\npragma: no-cache",
                "ax_size": 7,
                "ax_url": "https://mcs.snssdk.com/list",
                "ax_href": "https://mcs.snssdk.com/list",
                "ax_search": "",
                "resource_timing": {
                    "name": "https://mcs.snssdk.com/list",
                    "entryType": "resource",
                    "startTime": 1645.3999998569489,
                    "duration": 63.299999952316284,
                    "initiatorType": "xmlhttprequest",
                    "nextHopProtocol": "http/1.1",
                    "workerStart": 0,
                    "redirectStart": 0,
                    "redirectEnd": 0,
                    "fetchStart": 1645.3999998569489,
                    "domainLookupStart": 0,
                    "domainLookupEnd": 0,
                    "connectStart": 0,
                    "connectEnd": 0,
                    "secureConnectionStart": 0,
                    "requestStart": 0,
                    "responseStart": 0,
                    "responseEnd": 1708.6999998092651,
                    "transferSize": 0,
                    "encodedBodySize": 0,
                    "decodedBodySize": 0,
                    "serverTiming": [],
                    "workerTiming": []
                },
                "version": "3.6.42",
                "hostname": "juejin.cn",
                "protocol": "https",
                "url": "https://juejin.cn/",
                "slardar_session_id": this.slardar_session_id,
                "sample_rate": 1,
                "pid": "index",
                "report_domain": "i.snssdk.com",
                "screen_resolution": "1920x1080",
                "network_type": "4g",
                "bid": "juejin_web",
                "context": "{}",
                "slardar_web_id": this.monitior_web_id,
                "report_type": "xhr",
                "performanceAuto": false,
                "reportURLSingle": "https://i.snssdk.com/log/sentry/v2/api/slardar/main/",
                "region": "cn",
                "env": "production",
                "refreshPrecollectedContext": false,
                "maxBatchReportLength": 10,
                "batchReportWait": 1000,
                "client_time": new Date().getTime()
                },
                {
                "ev_type": "ajax",
                "ax_status": "200",
                "ax_type": "post",
                "ax_request_header": "Content-Type: application/json; charset=utf-8",
                "ax_domain": "mcs.snssdk.com",
                "ax_duration": 71,
                "ax_path": "/list",
                "ax_protocol": "https",
                "ax_response_header": "cache-control: no-store, no-cache, must-revalidate\r\ncontent-length: 7\r\ncontent-type: application/json; charset=utf-8\r\nexpires: 0\r\npragma: no-cache",
                "ax_size": 7,
                "ax_url": "https://mcs.snssdk.com/list",
                "ax_href": "https://mcs.snssdk.com/list",
                "ax_search": "",
                "resource_timing": {
                    "name": "https://mcs.snssdk.com/list",
                    "entryType": "resource",
                    "startTime": 2639.0999999046326,
                    "duration": 65.40000009536743,
                    "initiatorType": "xmlhttprequest",
                    "nextHopProtocol": "http/1.1",
                    "workerStart": 0,
                    "redirectStart": 0,
                    "redirectEnd": 0,
                    "fetchStart": 2639.0999999046326,
                    "domainLookupStart": 0,
                    "domainLookupEnd": 0,
                    "connectStart": 0,
                    "connectEnd": 0,
                    "secureConnectionStart": 0,
                    "requestStart": 0,
                    "responseStart": 0,
                    "responseEnd": 2704.5,
                    "transferSize": 0,
                    "encodedBodySize": 0,
                    "decodedBodySize": 0,
                    "serverTiming": [],
                    "workerTiming": []
                },
                "version": "3.6.42",
                "hostname": "juejin.cn",
                "protocol": "https",
                "url": "https://juejin.cn/",
                "slardar_session_id": this.slardar_session_id,
                "sample_rate": 1,
                "pid": "index",
                "report_domain": "i.snssdk.com",
                "screen_resolution": "1920x1080",
                "network_type": "4g",
                "bid": "juejin_web",
                "context": "{}",
                "slardar_web_id": this.monitior_web_id,
                "report_type": "xhr",
                "performanceAuto": false,
                "reportURLSingle": "https://i.snssdk.com/log/sentry/v2/api/slardar/main/",
                "region": "cn",
                "env": "production",
                "refreshPrecollectedContext": false,
                "maxBatchReportLength": 10,
                "batchReportWait": 1000,
                "client_time": new Date().getTime()
                },
                {
                "ev_type": "ajax",
                "ax_status": "200",
                "ax_type": "post",
                "ax_request_header": "Content-Type: application/json; charset=utf-8",
                "ax_domain": "mcs.snssdk.com",
                "ax_duration": 76,
                "ax_path": "/list",
                "ax_protocol": "https",
                "ax_response_header": "cache-control: no-store, no-cache, must-revalidate\r\ncontent-length: 7\r\ncontent-type: application/json; charset=utf-8\r\nexpires: 0\r\npragma: no-cache",
                "ax_size": 7,
                "ax_url": "https://mcs.snssdk.com/list",
                "ax_href": "https://mcs.snssdk.com/list",
                "ax_search": "",
                "resource_timing": {
                    "name": "https://mcs.snssdk.com/list",
                    "entryType": "resource",
                    "startTime": 2668.899999856949,
                    "duration": 74.40000009536743,
                    "initiatorType": "xmlhttprequest",
                    "nextHopProtocol": "http/1.1",
                    "workerStart": 0,
                    "redirectStart": 0,
                    "redirectEnd": 0,
                    "fetchStart": 2668.899999856949,
                    "domainLookupStart": 0,
                    "domainLookupEnd": 0,
                    "connectStart": 0,
                    "connectEnd": 0,
                    "secureConnectionStart": 0,
                    "requestStart": 0,
                    "responseStart": 0,
                    "responseEnd": 2743.2999999523163,
                    "transferSize": 0,
                    "encodedBodySize": 0,
                    "decodedBodySize": 0,
                    "serverTiming": [],
                    "workerTiming": []
                },
                "version": "3.6.42",
                "hostname": "juejin.cn",
                "protocol": "https",
                "url": "https://juejin.cn/",
                "slardar_session_id": this.slardar_session_id,
                "sample_rate": 1,
                "pid": "index",
                "report_domain": "i.snssdk.com",
                "screen_resolution": "1920x1080",
                "network_type": "4g",
                "bid": "juejin_web",
                "context": "{}",
                "slardar_web_id": this.monitior_web_id,
                "report_type": "xhr",
                "performanceAuto": false,
                "reportURLSingle": "https://i.snssdk.com/log/sentry/v2/api/slardar/main/",
                "region": "cn",
                "env": "production",
                "refreshPrecollectedContext": false,
                "maxBatchReportLength": 10,
                "batchReportWait": 1000,
                "client_time": new Date().getTime()
                },
                {
                "ev_type": "ajax",
                "ax_size": 0,
                "ax_type": "get",
                "ax_protocol": "https",
                "ax_domain": "api.juejin.cn",
                "ax_path": "/tag_api/v1/query_category_briefs",
                "ax_url": "https://api.juejin.cn/tag_api/v1/query_category_briefs",
                "ax_search": this.url_fix,
                "ax_href": `"https://api.juejin.cn/tag_api/v1/query_category_briefs${this.url_fix}"`,
                "ax_status": "200",
                "ax_duration": 155,
                "ax_response_header": "content-type: application/json; charset=utf-8",
                "ax_request_header": "content-type: application/json",
                "resource_timing": {
                    "name": `"https://api.juejin.cn/tag_api/v1/query_category_briefs${this.url_fix}"`,
                    "entryType": "resource",
                    "startTime": 1487.7999999523163,
                    "duration": 152.39999985694885,
                    "initiatorType": "fetch",
                    "nextHopProtocol": "h2",
                    "workerStart": 0,
                    "redirectStart": 0,
                    "redirectEnd": 0,
                    "fetchStart": 1487.7999999523163,
                    "domainLookupStart": 1487.7999999523163,
                    "domainLookupEnd": 1487.7999999523163,
                    "connectStart": 1487.7999999523163,
                    "connectEnd": 1487.7999999523163,
                    "secureConnectionStart": 1487.7999999523163,
                    "requestStart": 1555.0999999046326,
                    "responseStart": 1639.6999998092651,
                    "responseEnd": 1640.1999998092651,
                    "transferSize": 932,
                    "encodedBodySize": 632,
                    "decodedBodySize": 2702,
                    "serverTiming": [
                    {
                        "name": "inner",
                        "duration": 20,
                        "description": ""
                    },
                    {
                        "name": "cdn-cache",
                        "duration": 0,
                        "description": "MISS"
                    },
                    {
                        "name": "edge",
                        "duration": 0,
                        "description": ""
                    },
                    {
                        "name": "origin",
                        "duration": 46,
                        "description": ""
                    }
                    ],
                    "workerTiming": []
                },
                "version": "3.6.42",
                "hostname": "juejin.cn",
                "protocol": "https",
                "url": "https://juejin.cn/",
                "slardar_session_id": this.slardar_session_id,
                "sample_rate": 1,
                "pid": "index",
                "report_domain": "i.snssdk.com",
                "screen_resolution": "1920x1080",
                "network_type": "4g",
                "bid": "juejin_web",
                "context": "{}",
                "slardar_web_id": this.monitior_web_id,
                "report_type": "xhr",
                "performanceAuto": false,
                "reportURLSingle": "https://i.snssdk.com/log/sentry/v2/api/slardar/main/",
                "region": "cn",
                "env": "production",
                "refreshPrecollectedContext": false,
                "maxBatchReportLength": 10,
                "batchReportWait": 1000,
                "client_time": new Date().getTime()
                },
                {
                "ev_type": "ajax",
                "ax_size": 0,
                "ax_type": "post",
                "ax_protocol": "https",
                "ax_domain": "api.juejin.cn",
                "ax_path": "/recommend_api/v1/dislike/white_list",
                "ax_url": "https://api.juejin.cn/recommend_api/v1/dislike/white_list",
                "ax_search": this.url_fix,
                "ax_href": `https://api.juejin.cn/recommend_api/v1/dislike/white_list${this.url_fix}`,
                "ax_status": "200",
                "ax_duration": 171,
                "ax_response_header": "content-type: application/json; charset=utf-8",
                "ax_request_header": "content-type: application/json",
                "resource_timing": {
                    "name": `https://api.juejin.cn/recommend_api/v1/dislike/white_list${this.url_fix}`,
                    "entryType": "resource",
                    "startTime": 2679.5,
                    "duration": 168.79999995231628,
                    "initiatorType": "fetch",
                    "nextHopProtocol": "h2",
                    "workerStart": 0,
                    "redirectStart": 0,
                    "redirectEnd": 0,
                    "fetchStart": 2679.5,
                    "domainLookupStart": 2679.5,
                    "domainLookupEnd": 2679.5,
                    "connectStart": 2679.5,
                    "connectEnd": 2679.5,
                    "secureConnectionStart": 2679.5,
                    "requestStart": 2750.7999999523163,
                    "responseStart": 2847.899999856949,
                    "responseEnd": 2848.2999999523163,
                    "transferSize": 478,
                    "encodedBodySize": 178,
                    "decodedBodySize": 283,
                    "serverTiming": [
                    {
                        "name": "inner",
                        "duration": 16,
                        "description": ""
                    },
                    {
                        "name": "cdn-cache",
                        "duration": 0,
                        "description": "MISS"
                    },
                    {
                        "name": "edge",
                        "duration": 0,
                        "description": ""
                    },
                    {
                        "name": "origin",
                        "duration": 59,
                        "description": ""
                    }
                    ],
                    "workerTiming": []
                },
                "version": "3.6.42",
                "hostname": "juejin.cn",
                "protocol": "https",
                "url": "https://juejin.cn/",
                "slardar_session_id": this.slardar_session_id,
                "sample_rate": 1,
                "pid": "index",
                "report_domain": "i.snssdk.com",
                "screen_resolution": "1920x1080",
                "network_type": "4g",
                "bid": "juejin_web",
                "context": "{}",
                "slardar_web_id": this.monitior_web_id,
                "report_type": "xhr",
                "performanceAuto": false,
                "reportURLSingle": "https://i.snssdk.com/log/sentry/v2/api/slardar/main/",
                "region": "cn",
                "env": "production",
                "refreshPrecollectedContext": false,
                "maxBatchReportLength": 10,
                "batchReportWait": 1000,
                "client_time": new Date().getTime()
                },
                {
                "ev_type": "ajax",
                "ax_status": "200",
                "ax_type": "post",
                "ax_request_header": "Content-Type: application/json; charset=utf-8",
                "ax_domain": "mcs.snssdk.com",
                "ax_duration": 107,
                "ax_path": "/list",
                "ax_protocol": "https",
                "ax_response_header": "cache-control: no-store, no-cache, must-revalidate\r\ncontent-length: 7\r\ncontent-type: application/json; charset=utf-8\r\nexpires: 0\r\npragma: no-cache",
                "ax_size": 7,
                "ax_url": "https://mcs.snssdk.com/list",
                "ax_href": "https://mcs.snssdk.com/list",
                "ax_search": "",
                "resource_timing": {
                    "name": "https://mcs.snssdk.com/list",
                    "entryType": "resource",
                    "startTime": 3634.5999999046326,
                    "duration": 104.09999990463257,
                    "initiatorType": "xmlhttprequest",
                    "nextHopProtocol": "http/1.1",
                    "workerStart": 0,
                    "redirectStart": 0,
                    "redirectEnd": 0,
                    "fetchStart": 3634.5999999046326,
                    "domainLookupStart": 0,
                    "domainLookupEnd": 0,
                    "connectStart": 0,
                    "connectEnd": 0,
                    "secureConnectionStart": 0,
                    "requestStart": 0,
                    "responseStart": 0,
                    "responseEnd": 3738.699999809265,
                    "transferSize": 0,
                    "encodedBodySize": 0,
                    "decodedBodySize": 0,
                    "serverTiming": [],
                    "workerTiming": []
                },
                "version": "3.6.42",
                "hostname": "juejin.cn",
                "protocol": "https",
                "url": "https://juejin.cn/",
                "slardar_session_id": this.slardar_session_id,
                "sample_rate": 1,
                "pid": "index",
                "report_domain": "i.snssdk.com",
                "screen_resolution": "1920x1080",
                "network_type": "4g",
                "bid": "juejin_web",
                "context": "{}",
                "slardar_web_id": this.monitior_web_id,
                "report_type": "xhr",
                "performanceAuto": false,
                "reportURLSingle": "https://i.snssdk.com/log/sentry/v2/api/slardar/main/",
                "region": "cn",
                "env": "production",
                "refreshPrecollectedContext": false,
                "maxBatchReportLength": 10,
                "batchReportWait": 1000,
                "client_time": new Date().getTime()
                },
                {
                "ev_type": "ajax",
                "ax_status": "200",
                "ax_type": "post",
                "ax_request_header": "Content-Type: application/json; charset=utf-8",
                "ax_domain": "mcs.snssdk.com",
                "ax_duration": 64,
                "ax_path": "/list",
                "ax_protocol": "https",
                "ax_response_header": "cache-control: no-store, no-cache, must-revalidate\r\ncontent-length: 7\r\ncontent-type: application/json; charset=utf-8\r\nexpires: 0\r\npragma: no-cache",
                "ax_size": 7,
                "ax_url": "https://mcs.snssdk.com/list",
                "ax_href": "https://mcs.snssdk.com/list",
                "ax_search": "",
                "resource_timing": {
                    "name": "https://mcs.snssdk.com/list",
                    "entryType": "resource",
                    "startTime": 3688.199999809265,
                    "duration": 62.40000009536743,
                    "initiatorType": "xmlhttprequest",
                    "nextHopProtocol": "http/1.1",
                    "workerStart": 0,
                    "redirectStart": 0,
                    "redirectEnd": 0,
                    "fetchStart": 3688.199999809265,
                    "domainLookupStart": 0,
                    "domainLookupEnd": 0,
                    "connectStart": 0,
                    "connectEnd": 0,
                    "secureConnectionStart": 0,
                    "requestStart": 0,
                    "responseStart": 0,
                    "responseEnd": 3750.5999999046326,
                    "transferSize": 0,
                    "encodedBodySize": 0,
                    "decodedBodySize": 0,
                    "serverTiming": [],
                    "workerTiming": []
                },
                "version": "3.6.42",
                "hostname": "juejin.cn",
                "protocol": "https",
                "url": "https://juejin.cn/",
                "slardar_session_id": this.slardar_session_id,
                "sample_rate": 1,
                "pid": "index",
                "report_domain": "i.snssdk.com",
                "screen_resolution": "1920x1080",
                "network_type": "4g",
                "bid": "juejin_web",
                "context": "{}",
                "slardar_web_id": this.monitior_web_id,
                "report_type": "xhr",
                "performanceAuto": false,
                "reportURLSingle": "https://i.snssdk.com/log/sentry/v2/api/slardar/main/",
                "region": "cn",
                "env": "production",
                "refreshPrecollectedContext": false,
                "maxBatchReportLength": 10,
                "batchReportWait": 1000,
                "client_time": new Date().getTime()
                }
            ],
            "timestamp": new Date().getTime()
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
            });
    }

}

var userInfo = [
    {
        "user_name": "搬运工1号",
        "job_title": "捡垃圾",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/374f02a62f4687116d28d64cf87769f7~300x300.image",
        "description": "好啊",
        "company": "生产垃圾"
    },
    {
        "user_name": "前端架构师_斌少",
        "job_title": "web前端",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/mosaic-legacy/3797/2889309425~300x300.image",
        "description": "编码疯",
        "company": "涂鸦智能"
    },
    {
        "user_name": "面屏思过",
        "job_title": "前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/a6a474e6184fa6ebce71615fa6bd7e97~300x300.image",
        "description": "做一条咸鱼，闲着",
        "company": "上海某公司"
    },
    {
        "user_name": "3Y酱",
        "job_title": "前端开发",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/4add4aabb9ee0524bacb642de59c9e1d~300x300.image",
        "description": "",
        "company": "某信息技术有限公司"
    },
    {
        "user_name": "千叶风行",
        "job_title": "学生",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/15/16bf62dda65fb2a1~tplv-t2oaga2asx-image.image",
        "description": "喜欢把学到的东西写成博客",
        "company": "鹅厂"
    },
    {
        "user_name": "古尔丹",
        "job_title": "切图",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/1ab01741ddfd33f9d25b6a2a10be36be~300x300.image",
        "description": "",
        "company": "力量的代价"
    },
    {
        "user_name": "剑大瑞",
        "job_title": "钱端摸鱼攻城狮",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/9e9474545e34e3c3ff2145efc73b3b2e~300x300.image",
        "description": "【coder狂想曲】",
        "company": "小米 | FE"
    },
    {
        "user_name": "cooooooong",
        "job_title": "前端",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/8/16f8534a4086d0eb~tplv-t2oaga2asx-image.image",
        "description": "",
        "company": "京东"
    },
    {
        "user_name": "双口吕",
        "job_title": "前端工程师",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/1151d75a2c204f33c5957fdc66aa6038~300x300.image",
        "description": "",
        "company": "kkb"
    },
    {
        "user_name": "飞奔的蚂蚁",
        "job_title": "web前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/e87964574d0c74672259bb2a1e41ddb4~300x300.image",
        "description": "",
        "company": "王道控股"
    },
    {
        "user_name": "DejaVU",
        "job_title": "今天你学习了吗？",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/2228bb5888732989b8941ec92c171961~300x300.image",
        "description": "",
        "company": "0200"
    },
    {
        "user_name": "H丶J",
        "job_title": "bug-maker",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/0a4c590705ad9086ccd868cfaded345e~300x300.image",
        "description": "",
        "company": "小公司"
    },
    {
        "user_name": "李白不吃茶v",
        "job_title": "前端开花",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/9e86ab487bfb3e0356b171f92628673a~300x300.image",
        "description": "迷茫...",
        "company": "白淤"
    },
    {
        "user_name": "散人研",
        "job_title": "高级前端工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/02f8a4847ab38806ec9b15570e0dc76a~300x300.image",
        "description": "",
        "company": "保密"
    },
    {
        "user_name": "晒兜斯",
        "job_title": "前端工程师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/25/1724b7af72a8ecba~tplv-t2oaga2asx-image.image",
        "description": "",
        "company": "明源云"
    },
    {
        "user_name": "小狗狗坏心眼多着呢",
        "job_title": "前端",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/8a031733495d01e2bb4b3d2c24fa0ae4~300x300.image",
        "description": "起点",
        "company": "成都"
    },
    {
        "user_name": "程序员依扬",
        "job_title": "6666",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/5844e6ca4511e1d6ef373b8cdb6a9749~300x300.image",
        "description": "自律自省、追求自由",
        "company": "蚂蚁"
    },
    {
        "user_name": "Reaper622",
        "job_title": "前端开发",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/946266dad7765d2ffe8d60f4479a694f~300x300.image",
        "description": "前端学习者",
        "company": "字节跳动"
    },
    {
        "user_name": "H丶J",
        "job_title": "bug-maker",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/0a4c590705ad9086ccd868cfaded345e~300x300.image",
        "description": "",
        "company": "小公司"
    },
    {
        "user_name": "zoomdong",
        "job_title": "前端工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/872b13fd46bf7b34dc553b2bb9bbd464~300x300.image",
        "description": "github 是 fireairforce",
        "company": "123123"
    },
    {
        "user_name": "建国君",
        "job_title": "Front-End Developer",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/2336b441ed7403fbfa50776501f93f8b~300x300.image",
        "description": "在我们20岁的时候用30岁的心态来做事，那么当我们30岁的时候就可以享受别",
        "company": "找个上海的互联网企业~"
    },
    {
        "user_name": "xiaofu0825",
        "job_title": "cai前端niao",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/b94423581edc62b1fd1601a704b3462e~300x300.image",
        "description": "vue，小程序，公众号",
        "company": "自由侠"
    },
    {
        "user_name": "壹拾",
        "job_title": "前端划水员",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/ac1fdfd60ed06997760a8b68771584f8~300x300.image",
        "description": "每个新的技术都是踩在巨人的肩膀上衍生的",
        "company": "AI公司"
    },
    {
        "user_name": "Spe_VS_Jugg",
        "job_title": "进阶全栈工程师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/leancloud-assets/eZESytH1ZMZ1nJbSKKi1xGBpzSceVpcHTXyfdxSW~tplv-t2oaga2asx-image.image",
        "description": "①",
        "company": "保密"
    },
    {
        "user_name": "树新风迎新年",
        "job_title": "前端",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/21a0b8872d0cf6ab0e674ced2a5b5de8~300x300.image",
        "description": "",
        "company": "大学"
    },
    {
        "user_name": "tool",
        "job_title": "前端开发工程师",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/12c8d971f3bd7e553ce1bd741f73b194~300x300.image",
        "description": "成熟 幽默",
        "company": "兑吧"
    },
    {
        "user_name": "城池",
        "job_title": "前端工程师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/leancloud-assets/03e0b39d0d3bbeca3719.png~tplv-t2oaga2asx-image.image",
        "description": "天行健，君子以自强不息；地势坤，君子以厚德载物。",
        "company": "不知名的小公司"
    },
    {
        "user_name": "vbyzc",
        "job_title": "全能蠢材",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/87c2dcdf2b22ae0c8b70883481df8c5a~300x300.image",
        "description": "老衲喜欢撸前端的马，喝早晨的粥，跑下午的步，看晚上的书",
        "company": "厦门西海岸科技"
    },
    {
        "user_name": "幻白",
        "job_title": "前端",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/613f62d9902fab1bd9c12fafb17b57a4~300x300.image",
        "description": "全端开发",
        "company": "互联网公司"
    },
    {
        "user_name": "三妹不是佩奇啊",
        "job_title": "前端开发",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/194caf2bd6cf3b0986c7d41361fa2f92~300x300.image",
        "description": "do what you love and fuck the rest",
        "company": "pingan"
    },
    {
        "user_name": "主流青年",
        "job_title": "前端攻城狮",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/5/16c6130488b92650~tplv-t2oaga2asx-image.image",
        "description": "热爱前端🔆🌞🌡",
        "company": "苹果树"
    },
    {
        "user_name": "默默乄行走",
        "job_title": "前端小白",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/29/1725f8966b642acb~tplv-t2oaga2asx-image.image",
        "description": "walking on the road",
        "company": "🔥"
    },
    {
        "user_name": "CRMEB技术团队",
        "job_title": "开发工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/079f912ee9b04c876f684db70ffe3a3c~300x300.image",
        "description": "php  vue mysql redis",
        "company": "西安众邦网络科技有限公司"
    },
    {
        "user_name": "清一色天空",
        "job_title": "前端开发",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/24/16d62c7958563afa~tplv-t2oaga2asx-image.image",
        "description": "架构神聊者以及炫酷canvas、css3的好奇宝宝",
        "company": "摸鱼划水公司"
    },
    {
        "user_name": "前端古人云",
        "job_title": "前端",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/21/16e8e4b9d8beea11~tplv-t2oaga2asx-image.image",
        "description": "宅",
        "company": "斯彼得"
    },
    {
        "user_name": "jsweber",
        "job_title": "web前端开发工程师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/11/1683b800546296de~tplv-t2oaga2asx-image.image",
        "description": "成为程序员的经济学家",
        "company": "明略科技集团"
    },
    {
        "user_name": "木子昕泽",
        "job_title": "监事",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/f3bf2ac9aed3f66ea4c927962424a1fb~300x300.image",
        "description": "",
        "company": "瀛和传媒科技无锡有限公司"
    },
    {
        "user_name": "小胖子打怪兽",
        "job_title": "前端开发",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/03e87377efb1e579b21f1d93288dbfde~300x300.image",
        "description": "轮子上划船",
        "company": "北京旷视科技"
    },
    {
        "user_name": "microler",
        "job_title": "前端开发",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/mirror-assets/16beeea21a01a390a33~tplv-t2oaga2asx-image.image",
        "description": "喜欢做一件事情，在兼顾家庭生活工作的情况下，不管成与不成，对，就坚",
        "company": "理想梦想动力活力"
    },
    {
        "user_name": "爱写代码的蛋蛋",
        "job_title": "前端工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/1f5c141fdd8a16bc2c63e5e92cd0e271~300x300.image",
        "description": "写BUG",
        "company": "字节跳动"
    },
    {
        "user_name": "English_name",
        "job_title": "web",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/2b176d09376800efed3655de7369d827~300x300.image",
        "description": "你说的我都会，但我还是个废人",
        "company": "公司"
    },
    {
        "user_name": "lok666",
        "job_title": "Java开发工程师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/68f1d2d9ea0b47af7a93145273338853~tplv-t2oaga2asx-image.image",
        "description": "",
        "company": "one of BAT"
    },
    {
        "user_name": "__刃舞__",
        "job_title": "一个天天写后端代码的菜鸡前端 。。",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/1/165937d6cb1e675c~tplv-t2oaga2asx-image.image",
        "description": "C、Node、JS，日常研究造轮子",
        "company": "secrecy"
    },
    {
        "user_name": "程序员解决师",
        "job_title": "程序员解决师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/1/168a798dd33ef955~tplv-t2oaga2asx-image.image",
        "description": "",
        "company": "CBU首席程序员解决师"
    },
    {
        "user_name": "wulinsheng123",
        "job_title": "web前端",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/967416d4ccac5de5514ea65c6d3388ba~300x300.image",
        "description": "",
        "company": "仙豆智能机器人有限公司"
    },
    {
        "user_name": "波波苏",
        "job_title": "前端开发工程师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/11/1679cfa3cf6eee6e~tplv-t2oaga2asx-image.image",
        "description": "",
        "company": "百世集团"
    },
    {
        "user_name": "波波苏",
        "job_title": "前端开发工程师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/11/1679cfa3cf6eee6e~tplv-t2oaga2asx-image.image",
        "description": "",
        "company": "百世集团"
    },
    {
        "user_name": "K_448",
        "job_title": "web前端",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/ace2e2e5be4c9578679f382d52252141~300x300.image",
        "description": "Time is the fair and hope everyone wont regret.",
        "company": "上海数禾信息科技有限公司"
    },
    {
        "user_name": "nelhu",
        "job_title": "左撇子",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/109a8fdedf332952b0faa52ce26732b7~300x300.image",
        "description": "前端 B端业务 Node 项目基础支撑 脚手架",
        "company": "hh"
    },
    {
        "user_name": "子物",
        "job_title": "web前端程序员",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/e5c8403391f9f3f6475e893f109ccb8c~300x300.image",
        "description": "",
        "company": "野生程序员"
    },
    {
        "user_name": "幻白",
        "job_title": "前端",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/613f62d9902fab1bd9c12fafb17b57a4~300x300.image",
        "description": "全端开发",
        "company": "互联网公司"
    },
    {
        "user_name": "R181",
        "job_title": "404",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/981419c6118be5d2eb4fe3ef167d6ba0~300x300.image",
        "description": "生若直木，不语斧凿",
        "company": "🐽"
    },
    {
        "user_name": "Yeaseon_Zhang",
        "job_title": "前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/fcbe7b2c87ab476271ec2f2cd1bdae5d~300x300.image",
        "description": "做一个有信仰的人。如果没有，那么就让你成为自己的信仰！",
        "company": "Shopee"
    },
    {
        "user_name": "骑马的农民",
        "job_title": "骑马的农民",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/16/16abe8c2009175f1~tplv-t2oaga2asx-image.image",
        "description": "github:https://github.com/TIM168，欢迎star",
        "company": "农场"
    },
    {
        "user_name": "zane1",
        "job_title": "前端工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/c315fd759ae752a436b4d616c8b89f8b~300x300.image",
        "description": "总得有点追求",
        "company": "明源云"
    },
    {
        "user_name": "熊饲",
        "job_title": "子",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/4d24913f0b7952951ceb3b6a31b87907~300x300.image",
        "description": "走着看",
        "company": "瓜"
    },
    {
        "user_name": "吴尔沃o",
        "job_title": "前端攻城狮",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/a3495ca5b6be30cbb15964f404346cd1~300x300.image",
        "description": "I wish there were peace and love in the world of program",
        "company": "生活不易"
    },
    {
        "user_name": "吴尔沃o",
        "job_title": "前端攻城狮",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/a3495ca5b6be30cbb15964f404346cd1~300x300.image",
        "description": "I wish there were peace and love in the world of program",
        "company": "生活不易"
    },
    {
        "user_name": "Kian",
        "job_title": "前端梁山伯与后端祝英台杠",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/5c8e3e29d26a797f98a97d5bfbbf4ecf~300x300.image",
        "description": "",
        "company": "Google Chrome user"
    },
    {
        "user_name": "tingzhong",
        "job_title": "前端开发",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/mirror-assets/16941d0d3b03739ca4f~tplv-t2oaga2asx-image.image",
        "description": "前端开发",
        "company": "匿"
    },
    {
        "user_name": "小辉辉儿",
        "job_title": "前端工程师",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/789a5fba0bf6cd6d8e71b1eab74eef80~300x300.image",
        "description": "不积跬步无以至千里，不积小流无以成江海",
        "company": "前端菜鸟"
    },
    {
        "user_name": "幸福的帅狗",
        "job_title": "前端攻城狮",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/mirror-assets/168e08ef44af9a7a890~tplv-t2oaga2asx-image.image",
        "description": "一个致力于不规范页面编写的前端菜鸡",
        "company": "北京创世乐享科技有限公司"
    },
    {
        "user_name": "igsnow",
        "job_title": "Web开发者",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/26/15ff8dd0a317efae~tplv-t2oaga2asx-image.image",
        "description": "JS\\Python\\Swift爱好者，熟悉Java、Go、PHP",
        "company": "稻香村"
    },
    {
        "user_name": "Btoa",
        "job_title": "前端go",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/bf948e77ca21ab78365afd92a1a45dd3~300x300.image",
        "description": "new Promise",
        "company": "小公司"
    },
    {
        "user_name": "js技师",
        "job_title": "切图边角料",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/a0364d0b5228e298342d4aa883339609~300x300.image",
        "description": "喜欢唱、跳、rap、篮球",
        "company": "外包"
    },
    {
        "user_name": "百罗",
        "job_title": "前端工程师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/ce3968d9b7dfa1c3c0d01c51ead09795~300x300.image",
        "description": "",
        "company": "上上签"
    },
    {
        "user_name": "yeyan1996",
        "job_title": "less is more",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/2a65c7f9b2bc2dd9e24a5a2afef72040~300x300.image",
        "description": "你必须非常努力，才能显得毫不费力",
        "company": "bilibili"
    },
    {
        "user_name": "wangzy2019",
        "job_title": "前端工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/202ffd1f6eb29a2a6d605d5db63d52cd~300x300.image",
        "description": "",
        "company": "某A"
    },
    {
        "user_name": "yoUng9527",
        "job_title": "web小前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/35d01a216a640224b01d7451437f7fd3~300x300.image",
        "description": "蓉华前端！一起学前端，欢迎私信！",
        "company": "蓉华教育"
    },
    {
        "user_name": "深既",
        "job_title": "web前端",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/7ece32f150320d8fa78fd9f9b79a5f17~300x300.image",
        "description": "～",
        "company": "字节跳动"
    },
    {
        "user_name": "wyswill",
        "job_title": "engineer",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/abc9f2235a00893ca35a6b571b3e353c~300x300.image",
        "description": "长路漫漫，以剑为伴",
        "company": "Stark Industries"
    },
    {
        "user_name": "Sven0706",
        "job_title": "前端码农",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/f1eab125962a23bef8701ae1e8869577~300x300.image",
        "description": "",
        "company": "深圳"
    },
    {
        "user_name": "老汉儿憨憨",
        "job_title": "web前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/23b8f28b8c1483f5e1e59339476e3ccb~300x300.image",
        "description": "vue、node、webpack",
        "company": "北纬38°-"
    },
    {
        "user_name": "佚树",
        "job_title": "大前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/a4797d9893faecd38b03e1d5c470cfce~300x300.image",
        "description": "",
        "company": "帝都小国企"
    },
    {
        "user_name": "吉他之神 ",
        "job_title": "保护小动物",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/3a6093a18b6a3b1b60c071d325a0d46e~300x300.image",
        "description": "网红",
        "company": "蚂蚁"
    },
    {
        "user_name": "国服最强后羿",
        "job_title": "射手",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/7faf8e4a5734230a9b2331897f354b1d~300x300.image",
        "description": "国服最强后羿，不给就送。",
        "company": "王者峡谷"
    },
    {
        "user_name": "B站_江辰",
        "job_title": "前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/d50f98a57ec956717d448dacde987aa5~300x300.image",
        "description": "善于思考 选择大于努力 任何问题都可以给我发私信或邮箱 hezhiqianye@gmail.com",
        "company": "B站"
    },
    {
        "user_name": "本末",
        "job_title": "web",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/f35db923c196e24a5089d63c79e97b24~300x300.image",
        "description": "前端知识的搬运工，励志搬运三十年",
        "company": "散人"
    },
    {
        "user_name": "fe_bean",
        "job_title": "前端打杂",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/a3b73ff3de6a93191b6f5c5f60593dad~300x300.image",
        "description": "打杂，工具人",
        "company": "不足挂齿"
    },
    {
        "user_name": "未知本尊",
        "job_title": "前端开发",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/9c9bdf2b454626db693e399a6fe66037~300x300.image",
        "description": "",
        "company": "国际庄"
    },
    {
        "user_name": "删库跑路砖家",
        "job_title": "前端工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/mosaic-legacy/3791/5035712059~300x300.image",
        "description": "菜鸟一枚",
        "company": "一家很优秀的公司"
    },
    {
        "user_name": "无鱼大师",
        "job_title": "前端工程师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/9adcc55425f7b876eea7b072e44f3904~300x300.image",
        "description": "爱好学习",
        "company": "摸鱼"
    },
    {
        "user_name": "苏甚么",
        "job_title": "程序猿",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/a393ec3b29ce2b725bab2218808542c5~300x300.image",
        "description": "",
        "company": "上海竞动科技"
    },
    {
        "user_name": "Blueleee",
        "job_title": "前端",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/7d225f123bd6c0cb2e84ff208d4ca9ce~300x300.image",
        "description": "",
        "company": "契约锁"
    },
    {
        "user_name": "jianzhang810",
        "job_title": "前端开发",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/bf214fc40c325ee7e9cba11ca701af92~300x300.image",
        "description": "擅长写bug",
        "company": "Fine"
    },
    {
        "user_name": "抓到你了_摸鱼怪",
        "job_title": "前端攻城狮",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/8630a48d2d1a86d64c6afac8398c7cad~300x300.image",
        "description": "",
        "company": "摸鱼公司"
    },
    {
        "user_name": "狠_简单",
        "job_title": "前端工程师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/mosaic-legacy/3793/3114521287~300x300.image",
        "description": "小白白",
        "company": "某通动力"
    },
    {
        "user_name": "狠_简单",
        "job_title": "前端工程师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/mosaic-legacy/3793/3114521287~300x300.image",
        "description": "小白白",
        "company": "某通动力"
    },
    {
        "user_name": "历飞雨",
        "job_title": "设计师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/55fc86916d56e791f4b89b73d9bcd961~300x300.image",
        "description": "有事厉飞雨，无事韩老魔，杀人放火厉飞雨，万人敬仰韩天尊！",
        "company": "全亚洲最大的坑"
    },
    {
        "user_name": "记得清缓存",
        "job_title": "写BUG前端工程师",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/476ac18842971bb267f6691b362919b3~300x300.image",
        "description": "一个金钥匙插进一把普通的锁，怎么都打不开，然后来了一把铁钥匙，一下",
        "company": "北京"
    },
    {
        "user_name": "苏坡的爱豆",
        "job_title": "onClick工程师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/3adfd034c918fd0b549ef70d759cd346~300x300.image",
        "description": "少说多做",
        "company": "BUG的设计制造"
    },
    {
        "user_name": "提莫队长前来摸鱼",
        "job_title": "专业搬砖工",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e4896db2c5372b~tplv-t2oaga2asx-image.image",
        "description": "百万贷款涩会人",
        "company": "郑州某工地"
    },
    {
        "user_name": "乌昂",
        "job_title": "摸鱼测试",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/e703fbb67d3dce1c94427cf164db55e2~300x300.image",
        "description": "",
        "company": "测试摸鱼公司"
    },
    {
        "user_name": "你丑你先说",
        "job_title": "高级吹牛架构师",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/39775452f8b6e42723cd8fb66b735384~300x300.image",
        "description": "爱吹牛",
        "company": "某吹牛集团"
    },
    {
        "user_name": "蚂蚁呀嘿嘿",
        "job_title": "摸鱼总指挥",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/10/16f8d76639647807~tplv-t2oaga2asx-image.image",
        "description": "前端攻城狮",
        "company": "北京摸鱼总部"
    },
    {
        "user_name": "埃兰德欧神",
        "job_title": "产品",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/2b2de085a28a11f0b920cf951f61575e~300x300.image",
        "description": "唯一能持久的竞争优势就是胜过对手的学习能力",
        "company": "爱普斯科技"
    },
    {
        "user_name": "黑恶势力",
        "job_title": "前端开发",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/83b75d86a2db9a174ccc9badfe71f04d~300x300.image",
        "description": "放弃完美主义，执行力就是限时限量完成",
        "company": "美团"
    },
    {
        "user_name": "Martin_CCC",
        "job_title": "前端",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/mosaic-legacy/3796/2975850990~300x300.image",
        "description": "",
        "company": "涂鸦"
    },
    {
        "user_name": "情不知所起一往而深",
        "job_title": "flutter劝退工程师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/30/171ca542bafaf188~tplv-t2oaga2asx-image.image",
        "description": "深水鱼",
        "company": "深水鱼"
    },
    {
        "user_name": "写代码的隔壁老王",
        "job_title": "前端开发",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/21016d6a839b68e998b542010e379da8~300x300.image",
        "description": "干啥啥不行，吃啥啥不剩",
        "company": "干啥啥不行，吃啥啥不剩"
    },
    {
        "user_name": "星期五的他",
        "job_title": "学生",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/2454ccff79e82a091365abd045c6bd0c~300x300.image",
        "description": "永远积极向上，永远热泪盈眶！",
        "company": "南阳理工学院"
    },
    {
        "user_name": "AlbertYang0801",
        "job_title": "开发工程师(Java)",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/98095c05a5ff5fff902923fad54874f9~300x300.image",
        "description": "生活不止眼前的代码，还有迈向田野的步伐",
        "company": "不知名公司"
    },
    {
        "user_name": "AlbertYang0801",
        "job_title": "开发工程师(Java)",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/98095c05a5ff5fff902923fad54874f9~300x300.image",
        "description": "生活不止眼前的代码，还有迈向田野的步伐",
        "company": "不知名公司"
    },
    {
        "user_name": "没有什么期待才会偶遇惊喜",
        "job_title": "杀人",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/a4a271d7f38f84936b1dd370aa3ad42e~300x300.image",
        "description": "没有什么可以介绍的~",
        "company": "Kill without blinking"
    },
    {
        "user_name": "一拳一个小朋友",
        "job_title": "不是年轻小伙子，是女生",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/1021f5a5d9ddcae1f003191f54ef961b~300x300.image",
        "description": "不是渣渣，是大佬在锦衣夜行",
        "company": "无"
    },
    {
        "user_name": "芝麻ing",
        "job_title": "前端开发",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/d738122933113a84be8a0135dd518af5~300x300.image",
        "description": "上班才有时间聊天，下班很忙...",
        "company": "Shenzhen"
    },
    {
        "user_name": "肉包子_子",
        "job_title": "🚀来者犹可追",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/88e1d3a822cc0deb5cac365949cb3a50~300x300.image",
        "description": "",
        "company": "🏆"
    },
    {
        "user_name": "榴莲大樱桃",
        "job_title": "前端程序媛",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/325bc035b648135548381e55e88fe075~300x300.image",
        "description": "",
        "company": "外包公司"
    },
    {
        "user_name": "柴工",
        "job_title": "CV工程师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/12abaaa71a15b56e40c4ba009bd81500~300x300.image",
        "description": "",
        "company": "羊城"
    },
    {
        "user_name": "内涵段子TV",
        "job_title": "内涵工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/8a1fdcc2a32372d3603c8c047a3166fa~300x300.image",
        "description": "女王若爱我，便不是我的女王",
        "company": "内涵段子科技有限公司"
    },
    {
        "user_name": "Orokin",
        "job_title": "前端开发",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/91a83beffdab18327819c10c0f266d0e~300x300.image",
        "description": "温柔、克制、朴素、不怨、事缓则圆",
        "company": "996公司"
    },
    {
        "user_name": "拿铁三分糖",
        "job_title": "后端小菜鸟",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/9bd49850389e61db8e861d2854472bbe~300x300.image",
        "description": "",
        "company": "摸鱼集团"
    },
    {
        "user_name": "xiaojia",
        "job_title": "前端",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/9/7/de1dcb2eb41496b0bcea110f2e85a485~tplv-t2oaga2asx-image.image",
        "description": "努力不会被辜负，付出终将有回报。此时敲下去的每一行代码在未来都将是你登高的一步步台阶。",
        "company": "xxx"
    },
    {
        "user_name": "cshenger",
        "job_title": "前端",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/26/17251101fcd23d0b~tplv-t2oaga2asx-image.image",
        "description": "",
        "company": "上海银基"
    },
    {
        "user_name": "拿酒杯喝咖啡",
        "job_title": "前端",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/1b3ec1569d0a264afeda85499c84692b~300x300.image",
        "description": "",
        "company": "bug架构师"
    },
    {
        "user_name": "白日梦想家_",
        "job_title": "代码搬运工",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/a5a178e211093cc171c13acfc202b8c6~300x300.image",
        "description": "",
        "company": "BugLess"
    },
    {
        "user_name": "听说昵称有毒",
        "job_title": "自由工程师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/9c23c06dc0a04f56ab91b7215b6c01ef~300x300.image",
        "description": "",
        "company": "无业游民"
    },
    {
        "user_name": "小白_菜",
        "job_title": "法师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/34bcfa1bd98c68e28450efa103a5c4de~300x300.image",
        "description": "",
        "company": "霍格沃兹魔法学院研发部"
    },
    {
        "user_name": "你摸摸我这料子",
        "job_title": "前端CV师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/d3f79b81f3b78b16e05ad04b64961637~300x300.image",
        "description": "爱生活爱##",
        "company": "某知名小公司"
    },
    {
        "user_name": "Beater",
        "job_title": "FE R&D",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/1cc8aacf175b278adb20d9a779c9c8c0~300x300.image",
        "description": "",
        "company": "心脏跳动"
    },
    {
        "user_name": "小小喵",
        "job_title": "前端开发工程师",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/e9bca42ca7fd30d760afe60dc2a29580~300x300.image",
        "description": "",
        "company": "成都"
    },
    {
        "user_name": "马男波杰克",
        "job_title": "后端",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/efb4893893811faa88f7dd2125d92713~300x300.image",
        "description": "人只要认真努力，生活总会变好的",
        "company": "Bug生产队"
    },
    {
        "user_name": "朝露易晞",
        "job_title": "前端人生导师   情感疏导大师",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/2ca41b2320b30c3e6aed0f6b147e1fa5~300x300.image",
        "description": "",
        "company": "恒河宇宙太阳系南半球公司"
    },
    {
        "user_name": "wh1e3",
        "job_title": "前端",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/53f7dc1da42e9c6b819feab610d3b4da~300x300.image",
        "description": "摸鱼狂魔",
        "company": "物联网"
    },
    {
        "user_name": "十万伏特bkq",
        "job_title": "java",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/2f4589e8b5d913b30be4a69662cfd0df~300x300.image",
        "description": "",
        "company": "小司"
    },
    {
        "user_name": "樱空",
        "job_title": "前端",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/34f8fa92de2d941b791d032b7e38a1de~300x300.image",
        "description": "",
        "company": "炎创"
    },
    {
        "user_name": "真的不想加班",
        "job_title": "摸鱼开发工程师",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/9d1cdba9eb8a58d52b03edfd78508755~300x300.image",
        "description": "",
        "company": "摸鱼研究所"
    },
    {
        "user_name": "Xuanz",
        "job_title": "前端",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/13/170d3086a921a8cf~tplv-t2oaga2asx-image.image",
        "description": "",
        "company": "北京"
    },
    {
        "user_name": "大大滴满足",
        "job_title": "熟练得CVer",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/0c4a338695117c665dad58a160281d23~300x300.image",
        "description": "",
        "company": "CV大厂分厂"
    },
    {
        "user_name": "人称江湖骗子",
        "job_title": "前端",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/mosaic-legacy/3797/2889309425~300x300.image",
        "description": "",
        "company": "佳缘科技"
    },
    {
        "user_name": "_陆小凤",
        "job_title": "web前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/mosaic-legacy/3791/5070639578~300x300.image",
        "description": "",
        "company": "大公司啊"
    },
    {
        "user_name": "chenyuhu",
        "job_title": "前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/3c8268abdc3f7c94d6582dc1d9aac71d~300x300.image",
        "description": "vue electron react umi",
        "company": "六趣网络"
    },
    {
        "user_name": "哎哟嘞巴扎嘿",
        "job_title": "CRUD攻城狮",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/ea4dc90e4ddb2f677f18b71a6d6fbae7~300x300.image",
        "description": "CV+CC",
        "company": "996大厂"
    },
    {
        "user_name": "BlackBox",
        "job_title": "会一点后端的铁废物前端",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/bea31d93818e213de32a98135e7e8827~300x300.image",
        "description": "",
        "company": "希望公司没事"
    },
    {
        "user_name": "573e",
        "job_title": "全栈",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/9063968193dec40637b13770ef8bf0e5~300x300.image",
        "description": "集中一点，登峰造极！",
        "company": "Alibaba"
    },
    {
        "user_name": "Tifura",
        "job_title": "undefined",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/9/16a9bd7a756462a3~tplv-t2oaga2asx-image.image",
        "description": "",
        "company": "undefined"
    },
    {
        "user_name": "游戏界彭于晏",
        "job_title": "创始人CEO（游戏界彭于晏）",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/2530b71ad9ab5d688294e4f546ec252b~300x300.image",
        "description": "",
        "company": "Every Game"
    },
    {
        "user_name": "魔哦魔鱼",
        "job_title": "摸鱼小能手",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/6ee8fd6ea71e0d79bca65013c48a0ac3~300x300.image",
        "description": "",
        "company": "🍊"
    },
    {
        "user_name": "Jokerrr",
        "job_title": "前端小学生,Varlet",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/8c5d97a54a9fac96a3f0f1c32ac9f0e1~300x300.image",
        "description": "",
        "company": "无锡某公司"
    },
    {
        "user_name": "一杯仙气儿",
        "job_title": "大别山五好青年",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/f586d14bc4f9e4c3ec54fcefa753c4de~300x300.image",
        "description": "有空一起洗个jio",
        "company": "家里蹲屋里系"
    },
    {
        "user_name": "gduwivxgzuowbdvudja",
        "job_title": "gduwivxgzuowbdvudja",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/25/1660f463d81bbf58~tplv-t2oaga2asx-image.image",
        "description": "gduwivxgzuowbdvudja",
        "company": "gduwivxgzuowbdvudja"
    },
    {
        "user_name": "嘻嘻哈哈呦",
        "job_title": "前端小姐姐",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/d4ac499c466e723b8b9d2dccc64bb2c3~300x300.image",
        "description": "",
        "company": "火星XXX公司"
    },
    {
        "user_name": "圈重点要考",
        "job_title": "前端开发",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/15/172162a028d38fe8~tplv-t2oaga2asx-image.image",
        "description": "学习",
        "company": "不圈全是重点公司"
    },
    {
        "user_name": "治电小白菜",
        "job_title": "前端工程师",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/db8060aaf0c79a371b4ad94f98478c39~300x300.image",
        "description": "学习是我快乐",
        "company": "铜陵治电科技"
    },
    {
        "user_name": "APICreator",
        "job_title": "API捏造大师👿",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/91cdea559783d73168410d491d1e89aa~300x300.image",
        "description": "System.out.println(\"api捏造者\")",
        "company": "能力有限公司"
    },
    {
        "user_name": "我的代码_你自由了",
        "job_title": "目标",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/2a8d6ccfbc571fc588cf3c40657b0986~300x300.image",
        "description": "平常心就好",
        "company": "星辰大海"
    },
    {
        "user_name": "清风明月57",
        "job_title": "Java开发",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/200811dd53150d8552e2dfea78104eb2~300x300.image",
        "description": "",
        "company": "YZD"
    },
    {
        "user_name": "一号水泥工",
        "job_title": "水泥工",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/f584dc3c42c96d84d625c2308807ca51~300x300.image",
        "description": "我是一个只会写BUG的水泥工",
        "company": "你的公司"
    },
    {
        "user_name": "风起云涌",
        "job_title": "golang",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/a238bb82fe3cb25ffabf1832c0e70743~300x300.image",
        "description": "天之道,损有余而补不足.人之道,损不足而补有余",
        "company": "中国青年报"
    },
    {
        "user_name": "我是nice哥",
        "job_title": "切图仔",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/ff972697d827eaa236f21985670fe0fa~300x300.image",
        "description": "遇事不决量子力学",
        "company": "遇事不决量子力学有限公司"
    },
    {
        "user_name": "飞翔的cookie",
        "job_title": "前端工程师",
        "avatar_large": "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/943c7027800d458abf8487e6c829cf41~tplv-k3u1fbpfcp-watermark.image?",
        "description": "",
        "company": "某某树"
    },
    {
        "user_name": "Oblivion",
        "job_title": "web前端",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/605187b45e7a5d2225dfc014d2147252~300x300.image",
        "description": "要毫不吝啬的赞扬别人",
        "company": "搬砖公司"
    },
    {
        "user_name": "用户名xxx",
        "job_title": "渣渣前端",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/a5e49e725e38549ac85925d78f5d7299~300x300.image",
        "description": "摸鱼，烤鱼，炸鱼，炒鱼，钓鱼，买鱼，养鱼，除了摸鱼其他都不会",
        "company": "垮掉的公司"
    },
    {
        "user_name": "咸鱼抗旗",
        "job_title": "前端沸物",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/bf3adbb1844195fbeb1e88b0adcbf1c5~300x300.image",
        "description": "",
        "company": "某极品摸鱼司"
    },
    {
        "user_name": "IGRS",
        "job_title": "摸鱼选手",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/695728afc4838f6dae9466b93a2e1af6~300x300.image",
        "description": "",
        "company": "v  @"
    },
    {
        "user_name": "榴莲櫻桃",
        "job_title": "前端程序媛",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/6ee5b1ba31e318738c47e3201f6f8da6~300x300.image",
        "description": "",
        "company": "外包公司"
    },
    {
        "user_name": "打杂不易",
        "job_tilte": "打杂",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/abdcdf21b5185014c405ae80fe388220~300x300.image",
        "description": "",
        "company": "one piece"
    },
    {
        "user_name": "进军的王小二",
        "job_tilte": "前端攻城狮",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/d4519d73542e34814aec3a776f41fda0~300x300.image",
        "description": "一枚吃货~",
        "company": "不知名小公司"
    },
    {
        "user_name": "Daliang41836",
        "job_tilte": "资深程序员段子手",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/c22acc982a47f2fe009a9d66b402f864~300x300.image",
        "description": "vue+ webgl + btc",
        "company": "No.1"
    },
    {
        "user_name": "阎王地狱主宰",
        "job_tilte": "阎王",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/6f0fdc8e0286a2099e4537bee1382be3~300x300.image",
        "description": "万丈高楼平地起",
        "company": "冥界科技有限公司"
    },
    {
        "user_name": "浅浅丶",
        "job_tilte": "无bug工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/46e4d52b80783390240882032a65fdaf~300x300.image",
        "description": "",
        "company": "划水公司"
    },
    {
        "user_name": "jingo42513",
        "job_tilte": "渣蛙工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/9289ade0470750f1abb6c1b3567118a6~300x300.image",
        "description": "如果code也算技能的话",
        "company": "maya"
    },
    {
        "user_name": "Devine_He",
        "job_tilte": "iOS挖掘机",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded7953f00942e~tplv-t2oaga2asx-image.image",
        "description": "擅长写bug",
        "company": "xxxx"
    },
    {
        "user_name": "抠图大佬",
        "job_tilte": "抠图工程师",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/75773a2f30b0a0b7912b3415f6d52185~300x300.image",
        "description": "",
        "company": "Emmmm"
    },
    {
        "user_name": "水煮鱼片",
        "job_tilte": "搬砖的",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/611d403bb339ebed1c7a30c459485901~300x300.image",
        "description": "人非商品，无需说明",
        "company": "By My Self"
    },
    {
        "user_name": "安逸的咸鱼",
        "job_tilte": "面向搜索引擎开发工程师",
        "avatar_large": "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/20/172cfa1549a65fcb~tplv-t2oaga2asx-image.image",
        "description": "全栈开发，问啥啥都会，干啥啥不行",
        "company": "摸鱼前500强公司"
    },
    {
        "user_name": "haoyunlai",
        "job_tilte": "前端",
        "avatar_large": "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d769916ff5644c881a9637e8ed3dc27~tplv-k3u1fbpfcp-watermark.image?",
        "description": "沉迷于敲代码，无法自拔...........",
        "company": "深圳"
    },
    {
        "user_name": "你永远不懂我的心",
        "job_tilte": "java攻城狮",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/4757846480ec8ab1247eedec15c327fe~300x300.image",
        "description": "反清复明20年",
        "company": "快倒闭的公司"
    },
    {
        "user_name": "AlexKain",
        "job_tilte": "前端",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/82250ac0dfd5e648c9b467746c25ca17~300x300.image",
        "description": "心有猛虎.细嗅轻微",
        "company": "抬杠集团CTO"
    },
    {
        "user_name": "不懂前端的前端程序员",
        "job_tilte": "伊拉克导弹研发工程师",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/6e4332e9b4808c92f459b0fbda29fdd9~300x300.image",
        "description": "",
        "company": "伊拉克军事部"
    },
    {
        "user_name": "OnePsycho",
        "job_tilte": "听学前端面试",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/5a998b33d01c58c913fbfee8d3e4a040~300x300.image",
        "description": "无名之辈",
        "company": "OnePsycho"
    },
    {
        "user_name": "服务器宕机了",
        "job_tilte": "技术经理",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/6986f601a40f472299914167c28ebc3b~300x300.image",
        "description": "没得介绍",
        "company": "拾信文化"
    },
    {
        "user_name": "DamonLu",
        "job_tilte": "bug工程师",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/ba43f835a14138703ca48588ec0cb277~300x300.image",
        "description": "iOS，Java-Web",
        "company": "_(:з」∠)_"
    },
    {
        "user_name": "小码农UU",
        "job_tilte": "学生",
        "avatar_large": "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f22c353570040c89b1098d5591080e1~tplv-k3u1fbpfcp-watermark.image?",
        "description": "代码人生，人生编程。",
        "company": "没有"
    },
    {
        "user_name": "快乐的小贾同学",
        "job_tilte": "Android开发",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/1610281131a28a45b8b23fed2f6c27a1~300x300.image",
        "description": "接受自己的普通，然后全力以赴出众。",
        "company": "."
    },
    {
        "user_name": "铁锤001",
        "job_tilte": "前端",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/f4a8d4877aa96b23351bbace77f52837~300x300.image",
        "description": "vue react webgl node",
        "company": "龙湖"
    },
    {
        "user_name": "poo",
        "job_tilte": "前端开发工程师",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/b417e54e1f2f3af24b3a7fcd99391312~300x300.image",
        "description": "别叫我老猪佩奇，请叫我小土豆~ ~",
        "company": "海康威视"
    },
    {
        "user_name": "xier",
        "job_tilte": "后台",
        "avatar_large": "https://p3-passport.byteacctimg.com/img/user-avatar/e88eb04de2f68afb5a95e99a44e7b6b4~300x300.image",
        "description": "",
        "company": "武汉赛思云科技有限公司"
    },
    {
        "user_name": "文字里的永远",
        "job_tilte": "前端作死工程师",
        "avatar_large": "https://p6-passport.byteacctimg.com/img/user-avatar/46b67a7f3e7525bcb6a342df46095bcf~300x300.image",
        "description": "前端",
        "company": "成都"
    },
    {
        "user_name": "看星星的兔子",
        "job_tilte": "前端小白",
        "avatar_large": "https://p26-passport.byteacctimg.com/img/user-avatar/7971f89bb5266763f2d25cb19701914a~300x300.image",
        "description": "喜欢唱歌",
        "company": "未知"
    },
    {
        "user_name": "云深不知处595",
        "job_tilte": "摸鱼小王子",
        "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/630f69817c0b8a4e745a8fbd7886cac0~300x300.image",
        "description": "今日的星辰辉映太古的源起，过往的注视指引明日的生死",
        "company": "摸鱼传媒"
    }
]

let randomName = [
    "睡觉也要踹手手",
    "我的鱼干呢",
    "会有僵尸替我爱你",
    "干饭滴王",
    "甜到没边",
    "太上真菌",
    "行走的表情包",
    "小新没蜡笔",
    "小新卖蜡笔",
    "干饭少女",
    "印系少女咖喱酱",
    "纯天然少女",
    "菜就关起来",
    "中国颜值的半壁江山",
    "作业被我养的白白的",
    "不是你的微信好友",
    "别打扰我泡崽",
    "吃橘子吗",
    "羊村你美姐",
    "月亮是我踹弯的",
    "这个名字真的有十个字",
    "幼儿园抢饭第一名",
    "月亮爆炸辽",
    "是你的胖虎吗",
    "偷喝一口奶茶",
    "偏偏晚上会很饿 ",
    "奶茶给我一口",
    "我想再睡五分钟",
    "干饭少女拌饭酱",
    "全面小康的漏网之鱼",
    "痴呆少女阿巴酱",
    "饭也太好吃了趴",
    "好人一生平胸",
    "退役熬夜选手",
    "一米五的小可爱",
    "一天得喝八杯水",
    "睡到人间煮饭时",
    "激萌美少女李逵",
    "死于脚气攻心",
    "我想睡觉",
    "念经跑调ing",
    "今天有一点心动",
    "我超凶哒",
    "百事可爱",
    "今天吃饱了吗",
    "睡觉专业户",
    "月亮被我吃掉了",
    "可口可爱",
    "不要被被子封印住",
    "宠一身脾气",
    "萌界大人物",
    "可爱讨厌",
    "卖萌的小行家",
    "少女的英雄梦",
    "元气稚奈",
    "月亮失了约ˇ",
    "舔酸奶盖儿",
    "雨落长安恋佳人",
    "木浔与森.",
    "舔奶盖的小仙女",
    "退役魔法少女",
    "奶味伏地魔.",
    "有趣的网名女生",
    "月亮指挥官",
    "海风少女",
    "人间荒糖",
    "草莓啵啵兔",
    "仙气女孩",
    "温柔可爱正能量",
    "逆天的小盆友i",
    "盖世小可爱",
    "爱耍流氓的兔子",
    "撩汉小能",
    "猫步少女",
    "这个丫头有点坏",
    "迷人的小混蛋",
    "天大地大吃货称霸",
    "套路撩心",
    "幼稚泡泡猪",
    "来治汪星人的你",
    "桃气小可爱",
    "有趣的网名女生",
    "贩卖可爱",
    "地球太闹不适合我",
    "小呀么小骄傲",
    "℡躲被窩裏喝旺仔",
    "软萌音马尾萝莉",
    "少女诱惑力",
    "撒娇小小怪",
    "别抢我养的猪",
    "短腿的逆袭",
    "请出示嗲嗲证",
    "遛狗的小肥女",
    "樱花酱萌妹",
    "酒酿樱桃子",
    "坐超人撞飞机",
    "何方妖孽",
    "看我电不死你",
    "纯洁的小黄瓜",
    "师太，借个吻",
    "伊丽莎白鼠",
    "卖霜的小女孩",
    "兔兔酱噢思密达",
    "醒折花",
    "莎士比亚ak",
    "暖心萌菇凉",
    "国产大宝贝",
    "打不死的小怪",
    "干凈没朋友",
    "蘸点软妹酱",
    "跳进海里躲雨",
    "小姐，你比猪还瘦",
    "没有胸就不要凶",
    "进击的小学生",
    "搁浅的↘鱼",
    "祝你好孕",
    "爱咋咋地",
    "拿根辣条砸死你",
    "树军的小皮鞋",
    "仙女味软糖",
    "打小就酷",
    "芝士就是力量",
    "你的小祖宗",
    "香蕉王子^^",
    "长发老僧",
    "懒癌已扩散全身",
    "明人不放暗屁",
    "软萌炸酱机",
    "小瓶盖",
    "24k女神",
    "被忘录",
    "宅若久时天然呆",
    "夜爬男神窗",
    "四裤全输",
    "善解人衣",
    "蒙面操人",
    "染名利为你",
    "荡于旧街",
    "共老河山",
    "重故余温",
    "柒巷玖貓",
    "海曾是哭蓝的天",
    "飞跃巅峰",
    "花落心枯萎",
    "白衬如初",
    "青空如璃",
    "微笑在我",
    "城荒梦空",
    "派星儿",
    "回眸醉倾城、",
    "风中追风",
    "故巷旧梦",
    "雪蕊幽香",
    "梦碎",
    "生性凉薄为戒",
    "独留清风醉",
    "忍不住想念",
    "半城烟沙",
    "迷恋你给的爱",
    "笑着说没事",
    "来不及放手",
    "心逐渐糜烂",
    "活该",
    "南尘",
    "苏幕",
    "左梦里",
    "紫荆私语",
    "岑空",
    "任平生",
    "藏进树底",
    "山满雾",
    "杳杳瓷声",
    "山月不知心底事",
    "来日方长",
    "眉温如初",
    "逢心事",
    "简至文",
    "若游丝",
    "千踪灭",
    "岫青"
]

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
