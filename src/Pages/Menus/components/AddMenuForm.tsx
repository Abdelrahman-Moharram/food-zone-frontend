import React, { FormEvent, useState } from 'react'
import useForm from '../../../Components/Forms/hooks/useForm'
import { Button, Input, TextArea } from '../../../Components/Forms/ui'
import {
    EyeIcon,
    LayersIcon,
    LeftArrowIcon,
    LogoLight,
    PriceTagIcon,
    StarIcon,
    WarningIcon
} from '../../../Components/utils/Icons'
import { useTranslation } from 'react-i18next'
import { OverLayFuncAreaContainer } from '../../../Components/Modals/OverLayFuncArea'
import PolicyPoint from './PolicyPoint'
import notification from '../../../Components/Notifications'
import { useAddMenuMutation } from '../../../redux/api/menusApi'

const AddMenuForm = ({action}:{action:()=>void}) => {
    const { t }                     = useTranslation()
    const [warning, setWarning]     = useState(true)
    const [addMenu, { isLoading }]  = useAddMenuMutation()
    const {
        form,
        onChange,
        formErrors,
        setFormErrors,
        validateForm,
        getFormData,
    } = useForm({ title: '', description: '' })

    const submit = (e:FormEvent) => {
        if(!validateForm()){
            notification.error('solve all form errors before submission')
            return
        }
        addMenu({form: getFormData()})
            .unwrap()
            .then(res=>{
                notification.success(res?.detail || 'added successfully')
                action()
            })
            .catch(err=>{
                notification.error(err?.data?.detail || 'something went wrong')
                setFormErrors(err?.data?.errors)
            })
    }    

    return (
        <form onSubmit={e => { e.preventDefault(); submit(e)}} className=''>
            {
                warning ?
                    <NewMenuWarning />
                    :
                    <div className="">
                        <div className='my-2'>
                            <Input
                                labelId     = 'title'
                                onChange    = {onChange}
                                value       = {form?.title}
                                icon        = {<LogoLight />}
                                placeholder = {t('choose a good title for the menu eg: ( Sohour Menu, Deserts, ...etc)')}
                                max_length  = {100}
                                errors      = {formErrors?.title}
                                required
                            />
                        </div>
                        <div className='my-2'>
                            <TextArea
                                labelId     = 'description'
                                onChange    = {onChange}
                                value       = {form?.description}
                                placeholder = {t('Describe what is this menu for') + '...'}
                                max_length  = {150}
                                errors      = {formErrors?.description}
                                required
                            />
                        </div>
                    </div>
            }

            <div className="mt-8">
                <OverLayFuncAreaContainer>
                    <div className="justify-end w-full flex">
                        {
                            warning ?
                                <Button
                                    title   = {t('Next')}
                                    variant = 'primary'
                                    icon    = {<LeftArrowIcon />}
                                    onClick = {() => setWarning(false)}
                                    submit  = {false}
                                />
                                :
                                <Button
                                    title   = {t('Submit')}
                                    variant = 'primary'
                                    icon    = {<LogoLight />}
                                    submit
                                />
                        }
                    </div>
                </OverLayFuncAreaContainer>
            </div>
        </form>
    )
}

export default AddMenuForm





const NewMenuWarning = () => {
    const { t } = useTranslation()
    const PrivcyPoints = [
        {
            icon            : <EyeIcon />,
            title           : t('Only One Menu Appears to Customers'),
            description     : t('Customers will only see a single menu at a time, which is the menu currently set as the default.'),
            badge           : t('1 Active Menu')
        },
        {
            icon            : <StarIcon />,
            title           : t('Only One Default Menu Allowed'),
            description     : t('You can only designate one menu as the active default menu for your store at any given time.'),
            badge           : t('1 Default'),

        },
        {
            icon            : <LayersIcon />,
            title           : t('Maximum Limit of 4 Menus'),
            description     : t('Your restaurant can have at most 4 menus in total (e.g. Dine-in / Hall, Takeaway, Desserts, Sohour).'),
            badge           : t('Max 4 Menus'),

        },
        {
            icon            : <PriceTagIcon />,
            title           : t('Same Items, Different Prices'),
            description     : t('Multiple menus are meant for the same items with different prices (such as Dine-in hall prices vs. takeaway or delivery), not for splitting items needlessly.'),
            badge           : t('Price Differentiation'),
        }
    ]

    return (
        <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/80">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 text-base">
                    <WarningIcon />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-color">
                        {t('Important Guidelines Before Adding a Menu')}
                    </h4>
                    <p className="text-xs text-color/60 mt-1 leading-relaxed">
                        {t('Please review the following rules to ensure menus are created effectively and avoid duplicate or unnecessary menus.')}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                {
                    PrivcyPoints?.map(point => (
                        <PolicyPoint
                            key         = {point.title}
                            icon        = {point.icon}
                            title       = {point.title}
                            description = {point.description}
                            badge       = {point.badge}
                        />
                    ))
                }
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/70 text-xs">
                <span className="font-bold text-red-700">{t('Important Note')} : </span>
                <span className="font-normal text-red-600">
                    {t('Avoid creating duplicate menus with identical prices or items, as they provide no benefit and will not be displayed to customers.')}
                </span>
            </div>
        </div>
    )
}