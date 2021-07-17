import { SiteClient } from 'datocms-client'

export default async function createCommunity(request, response) {
    
    if(request.method === 'POST') {

        const TOKEN=process.env.GRAPHQL_FULL_TOKEN;

        const client = new SiteClient(TOKEN);

        const {creatorSlug, imageUrl, title} = request.body;

        const newRegister = await client.items.create({
            itemType: '968806',
            creatorSlug: creatorSlug.toLocaleLowerCase(),
            imageUrl,
            title
        })
    
        response.json({
            newRegister
        })

        return;
    }

}