import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { InterpogateClient } from './proto/interpogate.client';
import {
	ExtractModelGraphResponse_SuccessResponse,
	RunModelForwardRequest,
	RunModelForwardResponse,
	TokenizeRequest,
	TokenizeResponse_SuccessResponse,
	VisualizationMap
} from './proto/interpogate';
import { Empty } from './proto/google/protobuf/empty';

const GRPC_URL = 'http://0.0.0.0:5555';

const interpogateService = new InterpogateClient(
	new GrpcWebFetchTransport({
		baseUrl: GRPC_URL,
		format: 'binary',
		timeout: 600000
	})
);

const INCOMPLETE_RESPONSE = 'Incomplete response';

export async function getTokens(text: string): Promise<TokenizeResponse_SuccessResponse> {
	const tokenResponse = await interpogateService.getTokens(
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
	const getVocabResponse = await interpogateService.getVocab(Empty.create());
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
	const extractModelGraphResponse = await interpogateService.extractModelGraph(Empty.create());
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
): AsyncGenerator<RunModelForwardResponse, void, void> {
	const stream = interpogateService.runModelForward(
		RunModelForwardRequest.create({ tokenIds, visualizationMap })
	);
	for await (const response of stream.responses) {
		switch (response.response.oneofKind) {
			case 'errorResponse':
				throw new Error(response.response.errorResponse.message);
			case undefined:
				throw new Error(INCOMPLETE_RESPONSE);
			default:
				yield response;
		}
	}
}
