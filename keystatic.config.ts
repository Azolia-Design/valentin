// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    collections: {
        pages: collection({
            label: 'Pages',
            slugField: 'title',
            path: 'src/content/pages/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                content: fields.markdoc({ label: 'Content' }),
                hero: fields.object({
                    title: fields.text({ label: 'Hero Title' }),
                    subtitle: fields.text({ label: 'Hero Subtitle' }),
                    scopes: fields.array(
                        fields.text({ label: 'Hero Scope listing' }),
                        { label: 'Scope', itemLabel: props => props.value })
                }),
                introduction: fields.object({
                    title: fields.text({
                        label: 'Introduction Title',
                        multiline: true
                    }),
                    companies: fields.array(
                        fields.object({
                            name: fields.text({ label: 'Name' }),
                            logo: fields.image({ label: 'Logo', directory: 'public/images/company', publicPath: 'images/company' }),
                        }),
                        {
                            label: 'Introduction Company Listing',
                            itemLabel: (props) => props.fields.name.value,
                        })
                })
            },
        }),
},
})
// fields.text({ label: 'Introduction Company listing' }),
                        // { label: 'Company', itemLabel: props => props.value }