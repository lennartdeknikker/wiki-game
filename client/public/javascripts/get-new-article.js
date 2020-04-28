async function getRandomWikiLink() {
    const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
    const json = await response.json()
    return json.content_urls.desktop.page
}

async function main() {
    const link = await getRandomWikiLink()
    console.log(link)
}

main()