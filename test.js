import test from 'ava'
import Nightmare from 'nightmare'
import pad from 'pad'

const green = text => `\n\u{1b}[32m${text}\u{1b}[0m`
const red = text => `\n\u{1b}[31m${text}\u{1b}[0m`
const results = []
const links = [
'http://www89.zippyshare.com/v/o8sAsdjf/file.html',
]

links.forEach((link, index) => {
  test(`[${pad(2, index + 1, '0')}/${pad(2, links.length, '0')}] ${link}`, async t => {
    const downloadableUrl = await Nightmare({
      waitTimeout: 60000,
      gotoTimeout: 60000,
    })
      .goto(link)
      .wait('.logo')
      .evaluate(rootUrl => {
        const buttonDownload = document.querySelector('#dlbutton')
        return buttonDownload
           ? { status: 'ok', link: buttonDownload.href }
           : { status: 'no', link: rootUrl }
      }, link)
      .end()

    results.push(downloadableUrl)
    t.pass()
  })
})

test.after('finished', t => {
  const downloadableLinks = results.filter(({ status }) => status === 'ok')
  if (downloadableLinks.length) {
    console.log(green('✅  DOWNLOADABLE LINKS'))
    downloadableLinks.forEach(({ link }) => console.log(link))
  }

  const brokenLinks = results.filter(({ status }) => status === 'no')
  if (brokenLinks.length) {
    console.log(red('💥  BROKEN LINKS'))
    brokenLinks.forEach(({ link }) => console.log(link))
  }
})
