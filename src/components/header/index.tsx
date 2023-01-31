import { FC, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import Image from "next/image"
import Link from "next/link";
import useGetUser from "../../hooks/useGetUser";
import Clock from "../clock";

const profileNavigation: { name: string, href: string }[] = 
[
	{ name: 'Your Profile', href: '/profile' },
	{ name: 'Page Settings', href: '/settings' },
	{ name: 'Sign out', href: '/api/auth/signout' },
]


const classNames = (...classes: any[]) => classes.filter(Boolean).join(' ');

const Header: FC = () =>
{
	const { user, pageUrl }  = useGetUser();

	if (!user) 
	{
		return ( <></>)
	} 

	const mainNavigation = 
	[
		{ name: 'study room', href: `${pageUrl}/`, current: true },
	]
	const greeting = () => 
	{
		if (new Date().getHours() < 12) 
		{
			return "good morning";
		}
		else if (new Date().getHours() <= 16) 
		{
			return "good afternoon";
		}
		else 
		{
			return "good evening"
		}
	}

	return(
		<Disclosure 
			as="nav" 
			className="w-full font-serif rounded-b-2xl border-b-gray-800 border-b-4"
		>
			{({ open }) => (
				<>
					<div className="text-3xl font-serif font-medium float-left p-3 pl-4 text-gray-800">
						{`${greeting()}, ${user.nickname ? user.nickname : user.name}`}
					</div >
					<div className="text-3xl font-serif font-medium float-right hidden md:block p-3 pr-4 text-gray-700">
						<Clock />
					</div>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center">
								<div className="hidden md:block"> {/* Home Page Button */}
									<div className="ml-10 flex items-baseline space-x-4 text-lg">
										{mainNavigation.map((item) => (
											<Link 
												href={item.href}
												key={item.name}
												className={`${item.current
													? 'bg-gray-800 text-white'
													: 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md font-medium`
												}>
												{item.name}
											</Link>
										))}
									</div>
								</div>
							</div>
							<div className="hidden md:block"> {/** Desktop profile Navigation */}
								<div className="ml-4 flex items-center md:ml-6">

									{/* Profile dropdown */}
									<Menu as="div" className="ml-3 relative">
										<div>
											<Menu.Button className="flex rounded-full bg-gray-800 text-sm hover:ring-2 hover:ring-zinc-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-gray-800">
												<span className="sr-only">Open user menu</span>
												<Image className="h-12 w-12 rounded-full" src={user?.image ? user?.image : ""} alt="Profile" height={48} width={48} />
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-in duration-100"
											enterFrom="transform opacity-0 scale-75"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-100"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-75"
										>
											<Menu.Items className="font-serif absolute grid right-0 p-3 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
												{profileNavigation.map((item) => (
													<Menu.Item key={item.name}>
														{({ active }) => (
															<Link 
																href={(item.name !== "Sign out") ? `${pageUrl + item.href}` : item.href} 
																className={`${active ? 'bg-gray-100' : ''} block px-5 py-2 text-sm text-gray-700`}
																shallow={true}
															>
																{item.name}
															</Link>
														)}
													</Menu.Item>
												))}
											</Menu.Items>
										</Transition>
									</Menu>
								</div>
							</div>
							<div className="-mr-2 flex md:hidden"> {/* Mobile menu button */}
								
								<Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<MenuIcon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="md:hidden"> {/*Mobile View */}
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							{mainNavigation.map((item) => (
								<Disclosure.Button
									key={item.name}
									as="a"
									href={`${item.href}`}
									className={classNames(
										item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'block px-3 py-2 rounded-md text-base font-medium'
									)}
									aria-current={item.current ? 'page' : undefined}
								>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
						<div className="pt-4 pb-3 border-t border-gray-700">
							<div className="flex items-center px-5">
								<div className="flex-shrink-0">
									<Image 
										className="h-12 w-12 rounded-full border-4 border-gray-800" 
										src={user?.image ? user?.image : ""} alt="Profile Picture" 
										width={48} 
										height={48}
									/>
								</div>
								<div className="ml-3">
									<div className="text-base font-medium leading-none text-gray-900 pb-1">{user?.name}</div>
									<div className="text-sm font-medium leading-none text-gray-700">{user?.email}</div>
								</div>
								<button
									type="button"
									className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
								>
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div className="mt-3 px-2 space-y-1">
								{profileNavigation.map((item) => (
									<Disclosure.Button
										key={item.name}
										as="a"
										href={(item.name !== "Sign out") ? `${pageUrl + item.href}` : item.href}
										className="block px-3 py-2 border-gray-800 border-4 rounded-md text-base font-medium text-gray-800 hover:text-white hover:bg-gray-700"
									>
										{item.name}
									</Disclosure.Button>
								))}
							</div>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}

export default Header;