import { ResponseInterceptor } from '@common';
import { applyDecorators, CanActivate, Controller, Post, Type, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExcludeController,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponseOptions,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiResponseType = <TModel extends Type<any>>(model: TModel, isArray: boolean) => {
  return applyDecorators(
    ApiOkResponse({
      isArray: isArray,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseInterceptor) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
              isArray: {
                type: 'boolean',
                default: isArray,
              },
            },
          },
        ],
      },
    }),
  );
};

function getApiResponseOptions(description: string, dtoOrSchema: any, isArray = false): ApiResponseOptions {
  if (!dtoOrSchema) {
    return { description };
  }
  if (typeof dtoOrSchema === 'function') {
    return { description, type: dtoOrSchema, isArray };
  } else {
    return {
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseInterceptor) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(dtoOrSchema),
              },
              isArray: {
                type: 'boolean',
                default: isArray,
              },
            },
          },
        ],
      },
      isArray,
    };
  }
}

export const getBaseProperties = (status: number) => {
  return {
    status: { example: status },
    message: { example: 'success' },
  };
};

export const getPaginationProperties = () => {
  return {
    pagination: {
      properties: {
        limit: { example: 10 },
        page: { example: 1 },
        total: { example: 10 },
      },
    },
  };
};

export const getBaseSchema = ($ref: string | Function, status = 200) => {
  return {
    properties: {
      ...getBaseProperties(status),
      data: { $ref: getSchemaPath($ref) },
    },
  };
};

export const getPaginationSchema = ($ref: any, status = 200) => {
  return {
    properties: {
      ...getBaseProperties(status),
      data: {
        type: 'array',
        items: getApiResponseOptions('', $ref),
      },
      ...getPaginationProperties(),
    },
  };
};

/**
 * Swagger for api create
 * @param $ref Class Schema
 * @param name Name schema
 * @example ApiCreate(User, 'user')
 */
export const ApiCreate = ($ref: any, name: string) =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new ' + name }),
    ApiCreatedResponse(getApiResponseOptions('Create a new ' + name + ' successfully', $ref)),
    ApiBadRequestResponse({
      description: 'Wrong data type or missing data in body',
    }),
    ApiConflictResponse({
      description: 'Data create has been duplicated',
    }),
  );

/**
 * Swagger for api get list
 * @param $ref Class Schema
 * @param name Name schema
 * @example ApiGetAll(User, 'user')
 */
export const ApiGetAll = ($ref: any, name: string) =>
  applyDecorators(
    ApiOperation({ summary: 'Get list ' + name }),
    ApiOkResponse(getApiResponseOptions('Get list ' + name + ' successfully', $ref, true)),
  );

/**
 * Swagger for API get detail
 * @param $ref Class Schema
 * @param name Name schema
 * @example ApiGetOne(User, 'user')
 */
export const ApiGetOne = ($ref: any, name: string) =>
  applyDecorators(
    ApiOperation({ summary: 'Get detail a ' + name }),
    ApiOkResponse(getApiResponseOptions('Get detail a ' + name + ' successfully', $ref)),
    ApiNotFoundResponse({ description: 'Not found ' + name }),
  );

/**
 * Swagger for API update
 * @param $ref Class Schema
 * @param name Name schema
 * @example ApiUpdate(User, 'user')
 */
export const ApiUpdate = (name: string) =>
  applyDecorators(
    ApiOperation({ summary: 'Update a ' + name }),
    ApiOkResponse({ description: 'Update a ' + name + ' successfully' }),
    ApiBadRequestResponse({
      description: 'Wrong data type or missing data in body',
    }),
    ApiNotFoundResponse({ description: 'Not found ' + name }),
  );

/**
 * Swagger for API delete
 * @param $ref Class Schema
 * @param name Name schema
 * @example ApiDelete(User, 'user')
 */
export const ApiDelete = (name: string) =>
  applyDecorators(
    ApiOperation({ summary: 'remove a ' + name }),
    ApiOkResponse({ description: 'Remove a ' + name + ' successfully' }),
    ApiNotFoundResponse({ description: 'Not found ' + name }),
  );

/**
 * Swagger login
 * @param userType Type user
 * @example ApiLogin('user')
 */
export const ApiLogin = (userType: string, dto: Type<unknown> | Function | [Function] | string) =>
  applyDecorators(
    Post(`${userType}/login`),
    ApiBody({ type: dto }),
    ApiOperation({ summary: `Login ${userType}` }),
    ApiOkResponse({
      schema: {
        properties: {
          ...getBaseProperties(200),
          data: {
            properties: {
              accessToken: { example: 'string' },
              refreshToken: { example: 'string' },
            },
          },
        },
      },
    }),
  );

/**
 * Swagger login
 * @param userType Type user
 * @example ApiLogin('user')
 */
export const ApiSignUp = (dto: Type<unknown> | Function | [Function] | string) =>
  applyDecorators(
    Post('user/signup'),
    ApiBody({ type: dto }),
    ApiOperation({ summary: `Sign up user` }),
    ApiOkResponse({ description: 'Sign up successfully.' }),
  );

/**
 * Swagger logout
 * @param userType Type user
 * @example ApiLogout('user')
 */
export const ApiLogout = (userType: string, typeGuard: Function | CanActivate) =>
  applyDecorators(
    Post(`${userType}/logout`),
    UseGuards(typeGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: `Logout ${userType}` }),
    ApiOkResponse({ description: 'Logout successfully' }),
  );

/**
 * Swagger hide controller in production
 * @example ApiHideController()
 */
export const ApiHideController = () => applyDecorators(ApiExcludeController(process.env.NODE_ENV === 'production'));

/**
 * Swagger for controller
 * @example ApiController()
 */
export const ApiController = (name: string, $ref: Function[] | undefined) =>
  applyDecorators(ApiHideController(), ApiTags(`${name} API`), Controller('name'), ApiExtraModels(...$ref));
