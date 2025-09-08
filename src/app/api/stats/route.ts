import { NextRequest, NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/translation-cache';
import { db } from '@/db/connection';
import { apiUsage } from '@/db/schema';
import { eq, gte, desc, sql, and } from 'drizzle-orm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 401 }
      );
    }

    // Get cache statistics
    const cacheStats = await getCacheStats();

    // Get API usage statistics for the last 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const usageStats = await db
      .select({
        totalRequests: sql<number>`count(*)`,
        totalTokens: sql<number>`sum(${apiUsage.tokensUsed})`,
        totalCost: sql<number>`sum(${apiUsage.cost})`,
        averageResponseTime: sql<number>`avg(${apiUsage.responseTime})`,
      })
      .from(apiUsage)
      .where(
        and(
          eq(apiUsage.apiKey, apiKey),
          gte(apiUsage.createdAt, last24Hours)
        )
      );

    // Get top endpoints
    const topEndpoints = await db
      .select({
        endpoint: apiUsage.endpoint,
        count: sql<number>`count(*)`,
        totalTokens: sql<number>`sum(${apiUsage.tokensUsed})`,
        totalCost: sql<number>`sum(${apiUsage.cost})`,
      })
      .from(apiUsage)
      .where(
        and(
          eq(apiUsage.apiKey, apiKey),
          gte(apiUsage.createdAt, last24Hours)
        )
      )
      .groupBy(apiUsage.endpoint)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Get hourly usage for the last 24 hours
    const hourlyUsage = await db
      .select({
        hour: sql<string>`date_trunc('hour', ${apiUsage.createdAt})`,
        requests: sql<number>`count(*)`,
        tokens: sql<number>`sum(${apiUsage.tokensUsed})`,
        cost: sql<number>`sum(${apiUsage.cost})`,
      })
      .from(apiUsage)
      .where(
        and(
          eq(apiUsage.apiKey, apiKey),
          gte(apiUsage.createdAt, last24Hours)
        )
      )
      .groupBy(sql`date_trunc('hour', ${apiUsage.createdAt})`)
      .orderBy(sql`date_trunc('hour', ${apiUsage.createdAt})`);

    return NextResponse.json({
      success: true,
      data: {
        cache: cacheStats,
        usage: {
          last24Hours: usageStats[0] || {
            totalRequests: 0,
            totalTokens: 0,
            totalCost: 0,
            averageResponseTime: 0,
          },
          topEndpoints,
          hourlyUsage,
        },
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch statistics' 
      },
      { status: 500 }
    );
  }
}
