<script lang="ts">
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import { forwardPassMeta, selectedNode } from '../lib/store';
	import { shapeToString } from '../lib/ai';

	$: node = $selectedNode;
	$: forwardPass = $forwardPassMeta;
	$: inShape =
		forwardPass != null && node != null ? forwardPass.nodeShapes[node.id].inputShape : null;
	$: outShape =
		forwardPass != null && node != null ? forwardPass.nodeShapes[node.id].outputShape : null;
	$: inShapeStr = inShape != null ? shapeToString(inShape) : null;
	$: outShapeStr = outShape != null ? shapeToString(outShape) : null;
	$: inShapeLine =
		inShapeStr != null
			? `
        # input shape: ${inShapeStr}`
			: '';
	$: outShapeLine =
		outShapeStr != null
			? `
        # output shape: ${outShapeStr}`
			: '';

	$: template = `with interp.hook() as hook:
    def pre_hook(model, input):${inShapeLine}
        pass

    def post_hook(model, input, output):${outShapeLine}
        pass
    
    # Register hooks as needed
    hook.pre(${JSON.stringify(node?.path)}, pre_hook)
    hook.post(${JSON.stringify(node?.path)}, post_hook)

    # Run forward pass with interp.forward(**inputs), interp.forward_text(text), or model(**inputs)`;
</script>

<div class="card p-4 variant-glass-surface flex flex-col text-surface-900">
	<div class="font-bold uppercase text-sm mb-2">Hook Setup</div>
	<CodeBlock language="python" code={template}></CodeBlock>
</div>
