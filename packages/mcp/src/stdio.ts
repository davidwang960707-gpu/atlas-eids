#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createAtlasMcpServer } from './index.js'

const { server } = createAtlasMcpServer({ workspaceRoot: process.env.ATLAS_EIDS_WORKSPACE ?? process.cwd() })
const transport = new StdioServerTransport()
await server.connect(transport)
console.error('Atlas EIDS MCP Server is listening on stdio')
