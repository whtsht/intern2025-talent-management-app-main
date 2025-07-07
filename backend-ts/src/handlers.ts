import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Employee } from './employee/Employee';
import { EmployeeDatabaseDynamoDB } from './employee/EmployeeDatabaseDynamoDB';
import { EmployeeDatabase } from './employee/EmployeeDatabase';

const getEmployeeHandler = async (database: EmployeeDatabase, id: string, userId: string): Promise<APIGatewayProxyResult> => {
    const employee: Employee | undefined = await database.getEmployee(id, userId);
    if (employee == null) {
        console.log("A user is not found.");
        return { 
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            },
        };
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        },
        body: JSON.stringify(employee),
    };
};

const getEmployeesHandler = async (database: EmployeeDatabase, filterText: string, userId: string): Promise<APIGatewayProxyResult> => {
    const employees: Employee[] = await database.getEmployees(filterText, userId);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        },
        body: JSON.stringify(employees),
    };
};

export const handle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('event', event);
    try {
        const tableName = process.env.EMPLOYEE_TABLE_NAME;
        if (tableName == null) {
            throw new Error("The environment variable EMPLOYEE_TABLE_NAME is not specified.");
        }
        
        // Get user ID from Cognito claims
        const userId = event.requestContext.authorizer?.claims.sub;
        if (!userId) {
            console.log("User ID not found in claims");
            return { 
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                },
                body: JSON.stringify({ message: "Unauthorized" }),
            };
        }
        
        const client = new DynamoDBClient();
        const database = new EmployeeDatabaseDynamoDB(client, tableName);
        
        const path = normalizePath(event.path);
        const query = event.queryStringParameters;
        
        if (path === "/employees") {
            return getEmployeesHandler(database, query?.filterText ?? "", userId);
        } else if (path.startsWith("/employees/")) {
            const id = path.substring("/employees/".length);
            return getEmployeeHandler(database, id, userId);
        } else {
            console.log("Invalid path", path);
            return { 
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                },
            };
        }
    } catch (e) {
        console.error('Internal Server Error', e);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            },
            body: JSON.stringify({
                message: "Internal Server Error",
            }),
        };
    }
};

function normalizePath(path: string): string {
    return path.endsWith("/") ? path.slice(0, -1) : path;
}
