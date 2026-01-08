import { useGetHomePageQuery } from "../../services/apis/pageApi.jsx";
import { renderLiquid } from "../../theme/engine/renderLiquid";

function SiteRender() {
    const { data, isLoading } = useGetHomePageQuery();
    if (isLoading) return null;

    const renderBlock = (block) =>
        renderLiquid(block.template, {
            ...block.settings,
            target: block.settings?.newTab ? "_blank" : "",
            children: block.children?.map(renderBlock)
        });

    return (
        <div>
            {data.sections[0].blocks.map((block, i) => (
                <div
                    key={i}
                    dangerouslySetInnerHTML={{
                        __html: renderBlock(block)
                    }}
                />
            ))}
        </div>
    );
}

export default SiteRender;
