import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

export async function connectAtlasMcpStdio(options: { command?: string; args?: string[]; cwd?: string } = {}) {
  const client = new Client({ name: 'atlas-eids-client', version: '0.2.0-beta.3' })
  const transport = new StdioClientTransport({ command: options.command ?? 'atlas-eids-mcp', args: options.args ?? [], cwd: options.cwd })
  await client.connect(transport)
  return client
}

export async function connectAtlasMcpHttp(url: string | URL) {
  const client = new Client({ name: 'atlas-eids-client', version: '0.2.0-beta.3' })
  const transport = new StreamableHTTPClientTransport(new URL(url))
  await client.connect(transport)
  return client
}
