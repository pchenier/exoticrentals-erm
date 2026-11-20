import { BlogIndex } from '@/components/BlogViews';
import { pageMeta } from '@/lib/meta';
import { BLOG } from '@/lib/blog';

export const metadata = pageMeta({
  locale: 'en',
  title: 'Blog: Audi RS rental in Montreal, tips and comparisons | RentMyRS',
  description: 'Tips, comparisons and road trips for renting an Audi RS3, RS5, RS7, RSQ8 or R8 in Montreal, Laval and the North Shore.',
  path: BLOG,
});

export default function Page() {
  return <BlogIndex locale="en" />;
}
