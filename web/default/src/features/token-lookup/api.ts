/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { api } from '@/lib/api'

export type TokenLookupResult = {
  name: string
  status: number
  remain_quota: number
  used_quota: number
  unlimited_quota: boolean
  expired_time: number
  accessed_time: number
}

export async function lookupToken(token: string): Promise<TokenLookupResponse> {
  const res = await api.post(
    '/api/key/lookup',
    { token },
    {
      skipBusinessError: true,
      skipErrorHandler: true,
    }
  )
  return res.data
}

export type TokenLookupResponse = {
  success: boolean
  message?: string
  data?: TokenLookupResult | null
}
