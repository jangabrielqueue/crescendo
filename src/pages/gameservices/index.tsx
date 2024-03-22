import { Badge, Button, Card, Divider } from '@tremor/react'
import { clearCache, useDashboardCounters, useResources, useTopGrainMethods } from './api'
import React from 'react'
import useSnackbar from '@hooks/useSnackbar'

const GameServices = () => {
  const { data: resources, mutate } = useResources()
  const { data: counters, mutate: mCounters } = useDashboardCounters()
  const { data: topGrain, mutate: mtopGrain } = useTopGrainMethods()
  const { showError } = useSnackbar()
  const handleCache = async (name: string) => {
    try {
      await clearCache(name)
      mutate()
      mCounters()
      mtopGrain()
    } catch (e) {
      showError(e)
    }
  }
  return (
    <div className='flex flex-col gap-2 my-4'>
      <div className='flex flex-wrap gap-2'>
        {resources?.map((resource, idx) => (
          <Card key={idx} className='max-w-sm'>
            <div className='flex flex-col gap-4'>
              <p className='text-tremor-title text-context font-semibold'>{resource.name}</p>
              <p className='text-tremor-label text-context'>{resource.url}</p>
              <Button variant='light' onClick={() => handleCache(resource.name)} className='w-fit'>Clear Cache</Button>
            </div>
          </Card>
        ))}
      </div>
      <div className='flex flex-wrap gap-2'>
        {counters?.hosts?.map((host, idx) => (
          <Card key={idx} className='max-w-sm'>
            <div className='flex flex-col gap-2 text-context'>
              <p className='text-tremor-title font-semibold'>Host Name: {host.hostName}</p>
              <p className='text-tremor-label'>Alive Time: {host.iAmAliveTime}</p>
              <p className='text-tremor-label'>Start Time: {host.startTime}</p>
              <p className='text-tremor-label'>Silo Name: {host.siloName}</p>
              <p className='text-tremor-label'>Silo Address: {host.siloAddress}</p>
              <p className='text-tremor-label'>Silo Status: {host.status}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className='flex flex-wrap gap-2'>
        <Card className='max-w-sm text-context'>
          <p className='text-tremor-title'>Grain Stats</p>
          <Divider className='m-1' />
          {counters?.simpleGrainStats.filter(grain => grain.grainType.startsWith('Slot')).map((grain, idx) => (
            <React.Fragment key={idx}>
              <div className='flex justify-between'>
                <p className='text-tremor-default font-semibold'>{grain.grainType}</p>
                <Badge size='xs'>{grain.activationCount}</Badge>
              </div>
              <p className='text-tremor-label'>Silo Address: {grain.siloAddress}</p>
              <Divider className='m-1' />
            </React.Fragment>
          ))}
        </Card>
        <Card className='max-w-sm text-context'>
          <p className='text-tremor-title'>Methods with Most Calls</p>
          <Divider className='m-1' />
          {topGrain?.calls.map((calls, idx) => (
            <React.Fragment key={idx}>
              <div className='flex justify-between'>
                <p className='text-tremor-default font-semibold'>{calls.method}</p>
                <Badge size='xs'>{(calls.count / calls.numberOfSamples).toFixed(2)} req/sec</Badge>
              </div>
              <p className='text-tremor-label'>{calls.grain}</p>
              <Divider className='m-1' />
            </React.Fragment>
          ))}
        </Card>
        <Card className='max-w-sm text-context'>
          <p className='text-tremor-title'>Methods with Highest Latency</p>
          <Divider className='m-1' />
          {topGrain?.latency.map((latency, idx) => (
            <React.Fragment key={idx}>
              <div className='flex justify-between'>
                <p className='text-tremor-default font-semibold'>{latency.method}</p>
                <Badge size='xs'>{(latency.elapsedTime / latency.count).toFixed(2)} req/sec</Badge>
              </div>
              <p className='text-tremor-label'>{latency.grain}</p>
              <Divider className='m-1' />
            </React.Fragment>
          ))}
        </Card>
        <Card className='max-w-sm text-context'>
          <p className='text-tremor-title'>Methods with Most Exceptions</p>
          <Divider className='m-1' />
          {topGrain?.errors.map((latency, idx) => (
            <React.Fragment key={idx}>
              <div className='flex justify-between'>
                <p className='text-tremor-default font-semibold'>{latency.method}</p>
                <Badge size='xs'>{(latency.exceptionCount / latency.count).toFixed(2)} req/sec</Badge>
              </div>
              <p className='text-tremor-label'>{latency.grain}</p>
              <Divider className='m-1' />
            </React.Fragment>
          ))}
          {topGrain?.errors.length === 0 && <p>No Data</p>}
        </Card>
      </div>
    </div>
  )
}

export default GameServices
