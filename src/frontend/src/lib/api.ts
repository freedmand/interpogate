import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { InterpogateClient } from './proto/interpogate.client';
import {
	ExtractModelGraphResponse_SuccessResponse,
	PreloadedResponse,
	RunModelForwardRequest,
	RunModelForwardResponse_SuccessResponse,
	TokenizeRequest,
	TokenizeResponse_SuccessResponse,
	VisualizationMap
} from './proto/interpogate';
import { Empty } from './proto/google/protobuf/empty';
import { PLACEHOLDER } from './placeholder';

let preloadedResponse: PreloadedResponse | null = null;

// base64 to buffer
async function base64ToBufferAsync(base64: string): Promise<ArrayBuffer> {
	const dataUrl = `data:application/octet-binary;base64,${base64}`;

	const resp = await fetch(dataUrl);
	return await resp.arrayBuffer();
}

const GRPC_URL = 'http://0.0.0.0:5555';
let interpogateService: InterpogateClient | null = null;

export const standalone = PLACEHOLDER.startsWith('__PRELOADED_PLACEHOLDER');

export async function initializeApi() {
	if (!standalone) {
		// Preloaded
		const buffer = await base64ToBufferAsync(PLACEHOLDER);
		preloadedResponse = PreloadedResponse.fromBinary(new Uint8Array(buffer));
	} else {
		interpogateService = new InterpogateClient(
			new GrpcWebFetchTransport({
				baseUrl: GRPC_URL,
				format: 'binary',
				timeout: 600000
			})
		);
	}
}

const INCOMPLETE_RESPONSE = 'Incomplete response';

export async function getTokens(text: string): Promise<TokenizeResponse_SuccessResponse | null> {
	if (preloadedResponse != null) {
		if (preloadedResponse.forwardPass == null) {
			throw new Error('Expected forward pass to be populated for api.getTokens');
		}
		return preloadedResponse.forwardPass.tokens ?? null;
	}

	const tokenResponse = await interpogateService!.getTokens(
		TokenizeRequest.create({
			text
		})
	);
	switch (tokenResponse.response.response.oneofKind) {
		case 'successResponse':
			return tokenResponse.response.response.successResponse;
		case 'errorResponse':
			throw new Error(tokenResponse.response.response.errorResponse.message);
		case undefined:
			throw new Error(INCOMPLETE_RESPONSE);
	}
}

export async function getVocab(): Promise<string[]> {
	if (preloadedResponse != null) {
		if (preloadedResponse.vocab == null) return [];
		return preloadedResponse.vocab.vocab;
	}

	const getVocabResponse = await interpogateService!.getVocab(Empty.create());
	switch (getVocabResponse.response.response.oneofKind) {
		case 'errorResponse':
			throw new Error(getVocabResponse.response.response.errorResponse.message);
		case undefined:
			throw new Error(INCOMPLETE_RESPONSE);
		default:
			return getVocabResponse.response.response.successResponse.vocab;
	}
}

export async function extractModelGraph(): Promise<ExtractModelGraphResponse_SuccessResponse> {
	if (preloadedResponse != null) {
		return preloadedResponse.modelGraph!;
	}

	const extractModelGraphResponse = await interpogateService!.extractModelGraph(Empty.create());
	switch (extractModelGraphResponse.response.response.oneofKind) {
		case 'successResponse':
			return extractModelGraphResponse.response.response.successResponse;
		case 'errorResponse':
			throw new Error(extractModelGraphResponse.response.response.errorResponse.message);
		case undefined:
			throw new Error(INCOMPLETE_RESPONSE);
	}
}

export async function* runModelForward(
	tokenIds: number[],
	visualizationMap: VisualizationMap
): AsyncGenerator<RunModelForwardResponse_SuccessResponse, void, void> {
	if (preloadedResponse != null) {
		if (preloadedResponse.forwardPass == null) {
			throw new Error('Expected forward pass to be populated for api.runModelForward');
		}

		for (const response of preloadedResponse.forwardPass.forwardResponses) {
			yield response;
		}
		return;
	}

	const stream = interpogateService!.runModelForward(
		RunModelForwardRequest.create({ tokenIds, visualizationMap })
	);
	for await (const response of stream.responses) {
		switch (response.response.oneofKind) {
			case 'errorResponse':
				throw new Error(response.response.errorResponse.message);
			case undefined:
				throw new Error(INCOMPLETE_RESPONSE);
			default:
				yield response.response.successResponse;
		}
	}
}
