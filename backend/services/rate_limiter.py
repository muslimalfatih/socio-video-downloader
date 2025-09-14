from upstash_redis import Redis
from fastapi import HTTPException
import os
from datetime import datetime, timedelta


class RateLimiter:
	def __init__(self):
		self.redis = Redis(
			url=os.getenv("UPSTASH_REDIS_REST_URL"),
			token=os.getenv("UPSTASH_REDIS_REST_TOKEN"),
		)
		self.max_per_day = int(os.getenv("MAX_DOWNLOADS_PER_DAY", 5))

	async def check_rate_limit(self, identifier: str) -> dict:
		current_time = datetime.now()
		day_key = f"rate_limit:daily:{identifier}:{current_time.strftime('%Y%m%d')}"

		try:
			day_count = await self.redis.get(day_key) or 0
			day_count = int(day_count)

			if day_count >= self.max_per_day:
				tomorrow = (current_time + timedelta(days=1)).replace(
					hour=0, minute=0, second=0, microsecond=0
				)
				hours_until_reset = int(
					(tomorrow - current_time).total_seconds() / 3600
				)

				raise HTTPException(
					status_code=429,
					detail={
						"message": f"Daily download limit reached ({self.max_per_day} downloads per day)",
						"reset_in_hours": hours_until_reset,
						"reset_time": tomorrow.isoformat(),
						"downloads_used": day_count,
						"downloads_remaining": 0,
					},
				)

			await self.redis.incr(day_key)
			await self.redis.expire(day_key, 86400)

			return {
				"allowed": True,
				"downloads_used": day_count + 1,
				"downloads_remaining": self.max_per_day - day_count - 1,
			}

		except HTTPException:
			raise
		except Exception as e:
			print(f"Rate limiting error: {e}")
			return {
				"allowed": True,
				"downloads_used": 0,
				"downloads_remaining": self.max_per_day,
			}

	async def get_usage_info(self, identifier: str) -> dict:
        current_time = datetime.now()
        day_key = f"rate_limit:daily:{identifier}:{current_time.strftime('%Y%m%d')}"

        try:
            day_count = await self.redis.get(day_key) or 0
            day_count = int(day_count)

            tomorrow = (current_time + timedelta(days=1)).replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            hours_until_reset = int((tomorrow - current_time).total_seconds() / 3600)

            return {
                "downloads_used": day_count,
                "downloads_remaining": max(0, self.max_per_day - day_count),
                "reset_in_hours": hours_until_reset,
                "reset_time": tomorrow.isoformat(),
            }
        except Exception as e:
            print(f"Usage info error: {e}")
            return {
                "downloads_used": 0,
                "downloads_remaining": self.max_per_day,
                "reset_in_hours": 24,
            }
