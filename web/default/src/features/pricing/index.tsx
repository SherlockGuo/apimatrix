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
import { useCallback, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpenText, KeyRound, MessageSquareCode, Route } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '@/components/layout'
import { PageTransition } from '@/components/page-transition'
import { Button } from '@/components/ui/button'
import {
  LoadingSkeleton,
  EmptyState,
  SearchBar,
  PricingTable,
  PricingSidebar,
  PricingToolbar,
  ModelCardGrid,
  ModelDetailsDrawer,
} from './components'
import { EXCLUDED_GROUPS, VIEW_MODES } from './constants'
import { useFilters } from './hooks/use-filters'
import { usePricingData } from './hooks/use-pricing-data'
import { inferModelMetadata } from './lib/model-metadata'
import type { PricingModel } from './types'

const MEDIA_ENDPOINT_TYPES = new Set(['image-generation', 'openai-video'])
const MEDIA_MODEL_NAME_PATTERN =
  /\b(?:tts|voice|audio|whisper|realtime|video|sora|veo|kling|pika|imagen|dall[-_ ]?e|midjourney|mj)\b/i

const PROTOCOL_CARDS = [
  {
    title: 'OpenAI compatible',
    endpoint: '/v1/chat/completions',
    description: 'Chat completions for text and reasoning models',
  },
  {
    title: 'Claude Messages',
    endpoint: '/anthropic/messages',
    description: 'Anthropic-compatible messages endpoint',
  },
  {
    title: 'Gemini native',
    endpoint: '/gemini/v1/models/{model}:generateContent',
    description: 'Native Gemini text generation route',
  },
]

function isTextFirstModel(model: PricingModel) {
  const endpoints = model.supported_endpoint_types || []
  if (endpoints.some((endpoint) => MEDIA_ENDPOINT_TYPES.has(endpoint))) {
    return false
  }

  if (
    model.image_ratio != null ||
    model.audio_ratio != null ||
    model.audio_completion_ratio != null
  ) {
    return false
  }

  if (MEDIA_MODEL_NAME_PATTERN.test(model.model_name || '')) {
    return false
  }

  const metadata = inferModelMetadata(model)
  const mediaModalities = new Set(['image', 'audio', 'video'])
  return (
    !metadata.input_modalities.some((modality) => mediaModalities.has(modality)) &&
    !metadata.output_modalities.some((modality) =>
      mediaModalities.has(modality)
    )
  )
}

export function Pricing() {
  const { t } = useTranslation()
  const [selectedModelName, setSelectedModelName] = useState<string | null>(
    null
  )

  const {
    models,
    vendors,
    groupRatio,
    usableGroup,
    endpointMap,
    autoGroups,
    isLoading,
    priceRate,
    usdExchangeRate,
  } = usePricingData()

  const textModels = useMemo(
    () => (models || []).filter(isTextFirstModel),
    [models]
  )

  const {
    searchInput,
    sortBy,
    vendorFilter,
    groupFilter,
    quotaTypeFilter,
    endpointTypeFilter,
    tagFilter,
    tokenUnit,
    viewMode,
    showRechargePrice,
    setSearchInput,
    setSortBy,
    setVendorFilter,
    setGroupFilter,
    setQuotaTypeFilter,
    setEndpointTypeFilter,
    setTagFilter,
    setTokenUnit,
    setViewMode,
    setShowRechargePrice,
    filteredModels,
    hasActiveFilters,
    activeFilterCount,
    availableTags,
    clearFilters,
    clearSearch,
  } = useFilters(textModels)

  const handleModelClick = useCallback((modelName: string) => {
    setSelectedModelName(modelName)
  }, [])

  const selectedModel = useMemo(
    () =>
      selectedModelName
        ? textModels.find(
            (model) => model.model_name === selectedModelName
          ) || null
        : null,
    [selectedModelName, textModels]
  )

  const availableGroups = useMemo(
    () =>
      Object.keys(usableGroup || {}).filter(
        (g) => !EXCLUDED_GROUPS.includes(g)
      ),
    [usableGroup]
  )

  const handleClearAll = useCallback(() => {
    clearFilters()
    clearSearch()
  }, [clearFilters, clearSearch])

  const renderPricingContent = () => {
    if (filteredModels.length === 0) {
      return (
        <EmptyState
          searchQuery={searchInput}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearAll}
        />
      )
    }

    if (viewMode === VIEW_MODES.CARD) {
      return (
        <ModelCardGrid
          models={filteredModels}
          onModelClick={handleModelClick}
          priceRate={priceRate}
          usdExchangeRate={usdExchangeRate}
          tokenUnit={tokenUnit}
          showRechargePrice={showRechargePrice}
        />
      )
    }

    return (
      <PricingTable
        models={filteredModels}
        priceRate={priceRate}
        usdExchangeRate={usdExchangeRate}
        tokenUnit={tokenUnit}
        showRechargePrice={showRechargePrice}
        onModelClick={handleModelClick}
      />
    )
  }

  if (isLoading) {
    return (
      <PublicLayout showMainContainer={false}>
        <div className='mx-auto w-full max-w-[1800px] px-3 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-10 xl:px-8'>
          <LoadingSkeleton viewMode={viewMode} />
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      <div className='relative'>
        <PageTransition className='relative mx-auto w-full max-w-[1800px] px-3 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-10 xl:px-8'>
          <header className='bg-card mb-5 overflow-hidden rounded-lg border shadow-xs sm:mb-6'>
            <div className='grid gap-0 xl:grid-cols-[minmax(0,1fr)_34rem]'>
              <div className='space-y-5 p-4 sm:p-6'>
                <div className='space-y-2'>
                  <div className='text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase'>
                    <MessageSquareCode className='size-3.5' />
                    {t('Text model catalog')}
                  </div>
                  <h1 className='text-2xl leading-tight font-semibold tracking-tight sm:text-3xl'>
                    {t('Model Square')}
                  </h1>
                  <p className='text-muted-foreground max-w-3xl text-sm leading-relaxed sm:text-base'>
                    {t(
                      'Browse enabled text chat and reasoning models for OpenAI-compatible, Claude-compatible, and Gemini-compatible API calls.'
                    )}
                  </p>
                </div>

                <div className='grid gap-2 sm:grid-cols-3'>
                  <div className='rounded-md border p-3'>
                    <div className='text-muted-foreground text-xs'>
                      {t('Available text models')}
                    </div>
                    <div className='mt-1 font-mono text-2xl font-semibold tabular-nums'>
                      {textModels.length}
                    </div>
                  </div>
                  <div className='rounded-md border p-3'>
                    <div className='text-muted-foreground text-xs'>
                      {t('Providers')}
                    </div>
                    <div className='mt-1 font-mono text-2xl font-semibold tabular-nums'>
                      {(vendors || []).length}
                    </div>
                  </div>
                  <div className='rounded-md border p-3'>
                    <div className='text-muted-foreground text-xs'>
                      {t('Media routes')}
                    </div>
                    <div className='mt-1 text-sm font-semibold'>
                      {t('Not enabled')}
                    </div>
                  </div>
                </div>

                <SearchBar
                  value={searchInput}
                  onChange={setSearchInput}
                  onClear={clearSearch}
                  placeholder={t(
                    'Search model name, provider, endpoint, or tag...'
                  )}
                  className='max-w-3xl'
                />
              </div>

              <div className='border-t p-4 sm:p-6 xl:border-t-0 xl:border-l'>
                <div className='mb-3 flex items-center justify-between gap-3'>
                  <div className='text-sm font-semibold'>
                    {t('Compatible API routes')}
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      render={<Link to='/docs' />}
                    >
                      <BookOpenText className='size-4' />
                      {t('Docs')}
                    </Button>
                    <Button size='sm' render={<Link to='/keys' />}>
                      <KeyRound className='size-4' />
                      {t('API Keys')}
                    </Button>
                  </div>
                </div>

                <div className='space-y-2'>
                  {PROTOCOL_CARDS.map((item) => (
                    <div key={item.title} className='rounded-md border p-3'>
                      <div className='flex items-start gap-2'>
                        <div className='bg-muted flex size-8 shrink-0 items-center justify-center rounded-md'>
                          <Route className='text-primary size-4' />
                        </div>
                        <div className='min-w-0'>
                          <div className='text-sm font-medium'>
                            {t(item.title)}
                          </div>
                          <div className='text-muted-foreground mt-0.5 truncate font-mono text-xs'>
                            {item.endpoint}
                          </div>
                          <div className='text-muted-foreground mt-1 text-xs'>
                            {t(item.description)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <div className='grid gap-4 xl:grid-cols-[330px_minmax(0,1fr)]'>
            <PricingSidebar
              quotaTypeFilter={quotaTypeFilter}
              endpointTypeFilter={endpointTypeFilter}
              vendorFilter={vendorFilter}
              groupFilter={groupFilter}
              tagFilter={tagFilter}
              onQuotaTypeChange={setQuotaTypeFilter}
              onEndpointTypeChange={setEndpointTypeFilter}
              onVendorChange={setVendorFilter}
              onGroupChange={setGroupFilter}
              onTagChange={setTagFilter}
              vendors={vendors || []}
              groups={availableGroups}
              groupRatios={groupRatio}
              tags={availableTags}
              models={textModels}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              className='hover-scrollbar sticky top-4 hidden max-h-[calc(100dvh-2rem)] self-start overflow-y-auto xl:block'
            />

            <main className='min-w-0 space-y-4'>
              <PricingToolbar
                filteredCount={filteredModels.length}
                totalCount={textModels.length}
                sortBy={sortBy}
                onSortChange={setSortBy}
                tokenUnit={tokenUnit}
                onTokenUnitChange={setTokenUnit}
                showRechargePrice={showRechargePrice}
                onRechargePriceChange={setShowRechargePrice}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                quotaTypeFilter={quotaTypeFilter}
                endpointTypeFilter={endpointTypeFilter}
                vendorFilter={vendorFilter}
                groupFilter={groupFilter}
                tagFilter={tagFilter}
                onQuotaTypeChange={setQuotaTypeFilter}
                onEndpointTypeChange={setEndpointTypeFilter}
                onVendorChange={setVendorFilter}
                onGroupChange={setGroupFilter}
                onTagChange={setTagFilter}
                vendors={vendors || []}
                groups={availableGroups}
                groupRatios={groupRatio}
                tags={availableTags}
                models={textModels}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
                onClearFilters={clearFilters}
              />

              {renderPricingContent()}
            </main>
          </div>

          {selectedModel && (
            <ModelDetailsDrawer
              open={Boolean(selectedModel)}
              onOpenChange={(open) => {
                if (!open) setSelectedModelName(null)
              }}
              model={selectedModel}
              groupRatio={groupRatio || {}}
              usableGroup={usableGroup || {}}
              endpointMap={
                (endpointMap as Record<
                  string,
                  { path?: string; method?: string }
                >) || {}
              }
              autoGroups={autoGroups || []}
              priceRate={priceRate ?? 1}
              usdExchangeRate={usdExchangeRate ?? 1}
              tokenUnit={tokenUnit}
              showRechargePrice={showRechargePrice}
            />
          )}
        </PageTransition>
      </div>
    </PublicLayout>
  )
}
